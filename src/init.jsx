import '@assets/styles/application.scss';
import React, { useState, useEffect } from 'react';
import 'regenerator-runtime/runtime.js';

import {
  BrowserRouter as Router, Switch, Route, Redirect, Link,
} from 'react-router-dom';

import { Provider, useDispatch } from 'react-redux';
import { io } from 'socket.io-client';
import { setLocale } from 'yup';
import { useTranslation, I18nextProvider } from 'react-i18next';

import { addChannel, removeChannel, renameChannel } from '@slices/channels.js';
import { addMessage } from '@slices/messages.js';
import { useAuth } from '@hooks/index.js';

import configureStore from '@lib/configure-store.js';
import i18n from '@lib/i18n.js';
import { authContext, socketContext } from './contexts/index.js';
import routes from './routes-config.js';
import LogoutButton from './components/LogoutButton.jsx';

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
  const dispatch = useDispatch();
  const socket = io();

  useEffect(() => {
    socket.on('connect', () => {
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
        console.log(data);
        dispatch(addMessage(data));
      });
      setSocketConnected(true);
    });
  }, []);
  return (
    <socketContext.Provider value={{ socket, socketConnected }}>{children}</socketContext.Provider>
  );
};
const InstancesI18nextProvider = ({ children }) => {
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
  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
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
        <InstancesI18nextProvider>
          <Router>
            <div className="d-flex flex-column h-100">
              <nav className="shadow-sm navbar navbar-expand-lg navbar-light bg-white">
                <div className="container">
                  <a className="navbar-brand" href="/">
                    Hexlet Chat
                  </a>
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
                <Route path={routes.notMatchPage.path} component={routes.notMatchPage.component} />
              </Switch>
              <div className="card-footer p-4">
                <div className="text-center">
                  <span>Нет аккаунта?</span>
                  {' '}
                  <Link to={routes.signupPage.path}>Регистрация</Link>
                </div>
              </div>
            </div>
          </Router>
        </InstancesI18nextProvider>
      </SocketProvider>
    </AuthProvider>
  </Provider>
);

export default App;
