import React, { useState, useEffect, useCallback } from 'react';
import {
  BrowserRouter as Router, Switch, Route, Redirect,
} from 'react-router-dom';

import Rollbar from 'rollbar';
import i18n from 'i18next';
import { initReactI18next, useTranslation, I18nextProvider } from 'react-i18next';

import { Provider, useDispatch } from 'react-redux';
import { setLocale } from 'yup';
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import ruTranslation from './locales/ru/translation.js';

import { reducer as messagesReducer, addMessage as addMessageAction } from './chat/index.js';
import {
  reducer as channelsReducer,
  addChannel as addChannelAction,
  removeChannel as removeChannelAction,
  renameChannel as renameChannelAction,
} from './channel/index.js';
// import { addChannel, removeChannel, renameChannel } from './slices/channels.js';
// import { addMessage } from './slices/messages.js';

import { authContext, socketContext, rollbarContext } from './contexts/index.js';
import { useAuth } from './hooks/index.js';
import routes from './routes-config.js';
import Header from './components/Header.jsx';
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
/* eslint-disable-next-line max-len */
const RollbarProvider = ({ children, rollbar }) => (
  <rollbarContext.Provider value={{ rollbar }}>{children}</rollbarContext.Provider>
);
const SocketProvider = ({ children, socket }) => {
  const [socketConnected, setSocketConnected] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    socket.on('newChannel', (data) => {
      dispatch(addChannelAction(data));
    });
    socket.on('removeChannel', ({ id }) => {
      dispatch(removeChannelAction({ channelId: id }));
    });
    socket.on('renameChannel', (data) => {
      dispatch(renameChannelAction(data));
    });
    socket.on('newMessage', (data) => {
      dispatch(addMessageAction(data));
    });
    setSocketConnected(true);
  }, []);

  const addChannel = useCallback((data, cb) => {
    socket.volatile.emit('newChannel', data, cb);
  });
  const removeChannel = useCallback((data, cb) => {
    socket.volatile.emit('removeChannel', data, cb);
  });
  const renameChannel = useCallback((data, cb) => {
    socket.volatile.emit('renameChannel', data, cb);
  });
  const addMessage = useCallback((data, cb) => {
    socket.volatile.emit('newMessage', data, cb);
  });

  return (
    <socketContext.Provider
      value={{
        socket,
        socketConnected,
        addChannel,
        removeChannel,
        renameChannel,
        addMessage,
      }}
    >
      {children}
    </socketContext.Provider>
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
  console.log(channelsReducer);
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

  const rollbarConfig = {
    accessToken: '119359155be74a40a3d0ebe0973ee18f',
    environment: 'production',
  };

  const rollbar = new Rollbar(rollbarConfig);

  return (
    <RollbarProvider rollbar={rollbar}>
      <Provider store={store}>
        <AuthProvider>
          <SocketProvider socket={socket}>
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
          </SocketProvider>
        </AuthProvider>
      </Provider>
    </RollbarProvider>
  );
};
/* eslint-disable react/display-name */
export default (socket) => <App socket={socket} />;
