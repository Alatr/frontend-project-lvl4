import React, { useState, useEffect } from 'react';
import 'regenerator-runtime/runtime.js';
import '@assets/styles/application.scss';

import {
  BrowserRouter as Router, Switch, Route, Redirect,
} from 'react-router-dom';

import { Provider } from 'react-redux';
import { io } from 'socket.io-client';
import routes from './routes-config.js';
import { authContext, socketContext } from './contexts/index.js';
import { useAuth } from './hooks/index.js';

import configureStore from './configure-store.js';

const store = configureStore();

const AuthProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(!!JSON.parse(localStorage.getItem('userId')));

  const logIn = () => setLoggedIn(true);
  const logOut = () => {
    localStorage.removeItem('userId');
    setLoggedIn(false);
  };

  return (
    <authContext.Provider value={{ loggedIn, logIn, logOut }}>{children}</authContext.Provider>
  );
};
const SocketProvider = ({ children }) => {
  const [socketConnected, setSocketConnected] = useState(false);
  const socket = io();

  useEffect(() => {
    socket.on('connect', () => {
      setSocketConnected(true);
    });
  }, []);
  return (
    <socketContext.Provider value={{ socket, socketConnected }}>{children}</socketContext.Provider>
  );
};

const PrivateRoute = ({ path, component: Component }) => {
  const auth = useAuth();
  return (
    <Route
      path={path}
      render={({ location }) => (auth.loggedIn ? (
        <Component />
      ) : (
        <Redirect to={{ pathname: routes.loginPage.path, state: { from: location } }} />
      ))}
    />
  );
};

const App = () => (
  <Provider store={store}>
    <AuthProvider>
      <SocketProvider>
        <Router>
          <div className="d-flex flex-column h-100">
            <nav className="shadow-sm navbar navbar-expand-lg navbar-light bg-white">
              <div className="container">
                <a className="navbar-brand" href="/">
                  Hexlet Chat
                </a>
              </div>
            </nav>
            <Switch>
              <PrivateRoute
                exact
                path={routes.homePage.path}
                component={routes.homePage.component}
              />
              <Route path={routes.loginPage.path} component={routes.loginPage.component} />
              <Route path={routes.notMatchPage.path} component={routes.notMatchPage.component} />
            </Switch>
          </div>
        </Router>
      </SocketProvider>
    </AuthProvider>
  </Provider>
);

export default App;
