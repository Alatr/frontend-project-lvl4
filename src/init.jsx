import React from 'react';

import Rollbar from 'rollbar';
import i18n from 'i18next';
import { I18nextProvider } from 'react-i18next';

import { Provider } from 'react-redux';
import { setLocale } from 'yup';
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import ruTranslation from './locales/ru/translation.js';

import { reducer as messagesReducer, addMessage } from './chat/index.js';
import {
  reducer as channelsReducer,
  addChannel,
  removeChannel,
  renameChannel,
} from './channels/index.js';

import { ApiService, LoggerService, AuthService } from './services/index.js';
import App from './App.jsx';

export default async (api) => {
  const store = configureStore({
    reducer: combineReducers({
      channels: channelsReducer,
      messages: messagesReducer,
    }),
  });

  const i18nextInstance = i18n.createInstance();
  await i18nextInstance.init({
    resources: {
      ru: {
        translation: ruTranslation,
      },
    },
    fallbackLng: 'ru',
    lng: 'ru',
  });

  setLocale({
    mixed: {
      required: i18nextInstance.t('errors.required'),
      notOneOf: i18nextInstance.t('errors.notOneOf'),
    },
    string: {
      min: i18nextInstance.t('errors.min'),
      max: i18nextInstance.t('errors.max'),
    },
  });
  const logger = new Rollbar({
    accessToken: process.env.ROLLBAR_TOKEN,
    enabled: process.env.NODE_ENV === 'production',
  });
  api.on('newChannel', (data) => {
    store.dispatch(addChannel(data));
  });
  api.on('removeChannel', ({ id }) => {
    store.dispatch(removeChannel({ channelId: id }));
  });
  api.on('renameChannel', (data) => {
    store.dispatch(renameChannel(data));
  });
  api.on('newMessage', (data) => {
    store.dispatch(addMessage(data));
  });

  return (
    <LoggerService logger={logger}>
      <Provider store={store}>
        <ApiService api={api}>
          <AuthService>
            <I18nextProvider i18n={i18nextInstance}>
              <App />
            </I18nextProvider>
          </AuthService>
        </ApiService>
      </Provider>
    </LoggerService>
  );
};
