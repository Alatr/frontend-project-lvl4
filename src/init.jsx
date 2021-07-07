import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router, Switch, Route, Redirect, Link,
} from 'react-router-dom';

import i18n from 'i18next';
import { initReactI18next, useTranslation, I18nextProvider } from 'react-i18next';

import { Provider, useDispatch } from 'react-redux';
import { setLocale } from 'yup';
import { configureStore } from '@reduxjs/toolkit';
import ruTranslation from './locales/ru/translation.js';

import reducers from './slices/index.js';
import { addChannel, removeChannel, renameChannel } from './slices/channels.js';
import { addMessage } from './slices/messages.js';

import { authContext, socketContext } from './contexts/index.js';
import { useAuth } from './hooks/index.js';
import routes from './routes-config.js';
import LogoutButton from './components/LogoutButton.jsx';
import Footer from './components/Footer.jsx';

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
const SocketProvider = ({ children, socket }) => {
  const [socketConnected, setSocketConnected] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    socket.on('newChannel', (data) => {
      dispatch(addChannel(data));
    });
    socket.on('removeChannel', ({ id }) => {
      dispatch(removeChannel({ channelId: id }));
    });
    socket.on('renameChannel', (data) => {
      dispatch(renameChannel(data));
    });
    socket.on('newMessage', (data) => {
      dispatch(addMessage(data));
    });
    setSocketConnected(true);
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

const App = ({ socket }) => {
  const store = configureStore({
    reducer: reducers,
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

  return (
    <Provider store={store}>
      <AuthProvider>
        <SocketProvider socket={socket}>
          <I18nextProvider i18n={i18n}>
            <Router>
              <div className="d-flex flex-column h-100">
                <nav className="shadow-sm navbar navbar-expand-lg navbar-light bg-white">
                  <div className="container">
                    <Link className="navbar-brand" to={routes.homePage.path}>
                      Hexlet Chat
                    </Link>
                    <LogoutButton />
                  </div>
                </nav>
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
        </SocketProvider>
      </AuthProvider>
    </Provider>
  );
};
/* eslint-disable react/display-name */
export default (socket) => <App socket={socket} />;
