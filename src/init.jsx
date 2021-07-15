import React from 'react';

import Rollbar from 'rollbar';
import i18n from 'i18next';
import { initReactI18next, I18nextProvider } from 'react-i18next';

import { Provider } from 'react-redux';
import { setLocale } from 'yup';
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import ruTranslation from './locales/ru/translation.js';

import { reducer as messagesReducer } from './chat/index.js';
import { reducer as channelsReducer } from './channel/index.js';

import { ApiService, LoggerService, AuthService } from './services/index.js';
import App from './components/App.jsx';

export default (socket) => {
  const store = configureStore({
    reducer: combineReducers({
      channels: channelsReducer,
      messages: messagesReducer,
    }),
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
      useSuspense: false,
    },
  });

  setLocale({
    mixed: {
      required: i18n.t('errors.required'),
      notOneOf: i18n.t('errors.notOneOf'),
    },
    string: {
      min: i18n.t('errors.min'),
      max: i18n.t('errors.max'),
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
              <App />
            </I18nextProvider>
          </AuthService>
        </ApiService>
      </Provider>
    </LoggerService>
  );
};
/* eslint-disable react/display-name */
//  socket => <App socket={socket} />;
// export default init;
