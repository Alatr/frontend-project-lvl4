import axios from 'axios';
import React, { useContext, useState, createContext } from 'react';
import { routesApi as api } from './api-service.jsx';

const authContext = createContext({});
const { Provider } = authContext;

export const useAuth = () => useContext(authContext);

const getAuthHeader = () => {
  const userId = JSON.parse(localStorage.getItem('userId'));
  return userId && userId.token ? { Authorization: `Bearer ${userId.token}` } : {};
};

export const loggedFetch = async (path) => {
  const { data } = await axios.get(path, { headers: getAuthHeader() });
  return data;
};

const AuthService = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(Boolean(JSON.parse(localStorage.getItem('userId'))));

  const logIn = async (values) => {
    const { data } = await axios.post(api.login(), values);
    localStorage.setItem('userId', JSON.stringify(data));
    setLoggedIn(true);
  };

  const signUp = async (values) => {
    const { data } = await axios.post(api.signup(), values);
    localStorage.setItem('userId', JSON.stringify(data));
    setLoggedIn(true);
  };

  const logOut = () => {
    localStorage.removeItem('userId');
    setLoggedIn(false);
  };

  const getUserName = () => JSON.parse(localStorage.getItem('userId'))?.username;
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
