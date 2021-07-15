import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useAuth } from '../hooks/index.js';

import routes from '../routes-config.js';

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

export default PrivateRoute;
