import React from 'react';
import {
  BrowserRouter as Router, Switch, Route, Redirect,
} from 'react-router-dom';

import Rollbar from 'rollbar';
import i18n from 'i18next';
import { initReactI18next, useTranslation, I18nextProvider } from 'react-i18next';

import { Provider } from 'react-redux';
import { setLocale } from 'yup';
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import ruTranslation from './locales/ru/translation.js';

import { reducer as messagesReducer } from './chat/index.js';
import { reducer as channelsReducer } from './channel/index.js';

import { ApiService, LoggerService, AuthService } from './services/index.js';
import { useAuth } from './hooks/index.js';
import routes from './routes-config.js';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';

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

const App = ({ socket }) => {
  const store = configureStore({
    reducer: combineReducers({
      channels: channelsReducer,
      messages: messagesReducer,
    }),
    preloadedState: {},
  });

  const resources = {
    ru: {
      translation: ruTranslation,
    },
  };
  i18n.use(initReactI18next).init({
    resources,
    fallbackLng: 'ru',
    lng: 'ru',
    react: {
      wait: true,
      useSuspense: false,
    },
  });

  const { t } = useTranslation();
  setLocale({
    mixed: {
      required: t('errors.required'),
      notOneOf: t('errors.notOneOf'),
    },
    string: {
      min: t('errors.min'),
      max: t('errors.max'),
    },
  });

  const rollbar = new Rollbar({
    accessToken: '6dc24059411e474ca1a47c1cfe38e953',
    environment: 'development',
  });

  return (
    <LoggerService rollbar={rollbar}>
      <Provider store={store}>
        <ApiService socket={socket}>
          <AuthService>
            <I18nextProvider i18n={i18n}>
              <Router>
                <div className="d-flex flex-column h-100">
                  <Header />
                  <Switch>
                    <PrivateRoute
                      exact
                      path={routes.homePage.path}
                      component={routes.homePage.component}
                    />
                    <Route path={routes.loginPage.path} component={routes.loginPage.component} />
                    <Route path={routes.signupPage.path} component={routes.signupPage.component} />
                    <Route
                      path={routes.notMatchPage.path}
                      component={routes.notMatchPage.component}
                    />
                  </Switch>
                  <Footer />
                </div>
              </Router>
            </I18nextProvider>
          </AuthService>
        </ApiService>
      </Provider>
    </LoggerService>
  );
};
/* eslint-disable react/display-name */
export default (socket) => <App socket={socket} />;
