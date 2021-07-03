import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import ruTranslation from '../locales/ru/translation.js';

const resources = {
  ru: {
    translation: ruTranslation,
  },
};

i18n.use(initReactI18next).init({
  resources,
  load: 'languageOnly',
  fallbackLng: false,
  lng: 'ru',
  debug: process.env.NODE_ENV !== 'production',
  react: {
    wait: true,
  },
});

export default i18n;
