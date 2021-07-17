import React, {
  useContext, useState, useCallback, createContext,
} from 'react';

const authContext = createContext({});
export const useAuth = () => useContext(authContext);

const AuthService = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(Boolean(JSON.parse(localStorage.getItem('userId'))));

  const logIn = useCallback(() => setLoggedIn(true));
  const logOut = useCallback(() => {
    localStorage.removeItem('userId');
    setLoggedIn(false);
  });

  return (
    <authContext.Provider value={{ loggedIn, logIn, logOut }}>{children}</authContext.Provider>
  );
};

export default AuthService;
