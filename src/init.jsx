import React, { useState } from 'react';
import 'regenerator-runtime/runtime.js';
import '@assets/styles/application.scss';

import {
  BrowserRouter as Router, Switch, Route, Redirect,
} from 'react-router-dom';

import routes from './routes-config.js';
import authContext from './contexts/index.js';
import useAuth from './hooks/index.js';

const App = () => {
  const AuthProvider = ({ children }) => {
    const [loggedIn, setLoggedIn] = useState(false);

    const logIn = () => setLoggedIn(true);
    const logOut = () => {
      localStorage.removeItem('userId');
      setLoggedIn(false);
    };

    return (
      <authContext.Provider value={{ loggedIn, logIn, logOut }}>{children}</authContext.Provider>
    );
  };

  const PrivateRoute = ({ path, component }) => {
    const auth = useAuth();
    return (
      <Route
        path={path}
        render={({ location }) => (auth.loggedIn ? (
          component
        ) : (
          <Redirect to={{ pathname: routes.loginPage.path, state: { from: location } }} />
        ))}
      />
    );
  };

  return (
    <AuthProvider>
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
            <PrivateRoute exact path={routes.homePage.path} component={routes.homePage.component} />
            <Route path={routes.loginPage.path} component={routes.loginPage.component} />
            <Route path={routes.notMatchPage.path} component={routes.notMatchPage.component} />
          </Switch>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
