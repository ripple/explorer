import i18n from 'i18next';
import XHR from 'i18next-xhr-backend';
import languageDetector from './languageDetector';

const options = {
  debug: process.env.NODE_ENV === 'development',
  fallbackLng: 'en-US',
  ns: ['translations'], // have a common namespace used around the full app
  defaultNS: 'translations',
  keySeparator: false, // we use content as keys
  interpolation: {
    escapeValue: false, // not needed for react!!
    formatSeparator: ','
  },
  react: {
    wait: true
  },
  backend: {
    loadPath: '/locales/{{lng}}/{{ns}}.json'
  },
  load: 'currentOnly'
};

i18n
  .use(XHR)
  .use(languageDetector)
  .init(options);

export default i18n;
