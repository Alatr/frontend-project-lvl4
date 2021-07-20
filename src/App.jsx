import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import routes from './routes-config.js';
import Header from './components/Header.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';

const App = () => (
  <Router>
    <div className="d-flex flex-column h-100">
      <Header />
      <Switch>
        <PrivateRoute exact path={routes.homePage.path} component={routes.homePage.component} />
        <Route exact path={routes.loginPage.path} component={routes.loginPage.component} />
        <Route exact path={routes.signupPage.path} component={routes.signupPage.component} />
        <Route exact path={routes.notMatchPage.path} component={routes.notMatchPage.component} />
      </Switch>
    </div>
  </Router>
);
export default App;
