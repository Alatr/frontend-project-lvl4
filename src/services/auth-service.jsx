import axios from 'axios';
import React, { useContext, useState, createContext } from 'react';
import { routesApi as api } from './api-service.jsx';
import { useLogger } from './logger-service.jsx';

const authContext = createContext({});
const { Provider } = authContext;

export const useAuth = () => useContext(authContext);

const USER_ID = 'userId';
const getUser = () => JSON.parse(localStorage.getItem(USER_ID));
const setUser = (data) => localStorage.setItem(USER_ID, JSON.stringify(data));
const removeUser = () => localStorage.removeItem(USER_ID);

const getAuthHeader = () => {
  const user = getUser();
  return user && user.token ? { Authorization: `Bearer ${user.token}` } : {};
};

// TODO error lint
/* eslint-disable-next-line consistent-return */
export const loggedFetch = async (path) => {
  try {
    const { data } = await axios.get(path, { headers: getAuthHeader() });
    return data;
  } catch (error) {
    /* eslint-disable-next-line react-hooks/rules-of-hooks */
    useLogger().error(error);
  }
};

const AuthService = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(Boolean(getUser()));

  const logIn = async (values) => {
    const { data } = await axios.post(api.login(), values);
    setUser(data);
    setLoggedIn(true);
  };

  const signUp = async (values) => {
    const { data } = await axios.post(api.signup(), values);
    setUser(data);
    setLoggedIn(true);
  };

  const logOut = () => {
    removeUser();
    setLoggedIn(false);
  };

  const getUserName = () => getUser()?.username;
  return (
    <Provider
      value={{
        loggedIn,
        logIn,
        logOut,
        signUp,
        getUserName,
      }}
    >
      {children}
    </Provider>
  );
};

export default AuthService;
