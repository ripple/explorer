import { normalizeLanguage } from './containers/shared/utils';

const queryStringKey = 'lng';
const localStorageKey = 'i18nextLng';
let hasLocalStorageSupport;

try {
  hasLocalStorageSupport = window !== 'undefined' && window.localStorage !== null;
  const testKey = 'i18next.translate.boo';
  window.localStorage.setItem(testKey, 'foo');
  window.localStorage.getItem(testKey);
  window.localStorage.removeItem(testKey);
} catch (e) {
  hasLocalStorageSupport = false;
}

const getFromQS = () => {
  if (typeof window !== 'undefined') {
    const query = window.location.search.substring(1);
    const params = query.split('&');
    for (let i = 0; i < params.length; i += 1) {
      const parts = params[i].split('=');
      if (parts[0] === queryStringKey && parts[1]) {
        return normalizeLanguage(parts[1]);
      }
    }
  }

  return undefined;
};

const getFromLocalStorage = () =>
  hasLocalStorageSupport
    ? normalizeLanguage(window.localStorage.getItem(localStorageKey))
    : undefined;

const getFromNavigator = () => {
  const found = [];
  let normalized;

  if (typeof navigator !== 'undefined') {
    if (navigator.userLanguage) {
      found.push(navigator.userLanguage);
    }
    if (navigator.language) {
      found.push(navigator.language);
    }
    if (navigator.languages) {
      for (let i = 0; i < navigator.languages.length; i += 1) {
        found.push(navigator.languages[i]);
      }
    }
  }

  found.every(lang => {
    normalized = normalizeLanguage(lang);
    return !normalized;
  });

  return normalized;
};

const languageDetector = {
  init: Function.prototype,
  type: 'languageDetector',
  detect: () => getFromQS() || getFromLocalStorage() || getFromNavigator() || 'en-US',
  cacheUserLanguage: lng => {
    window.localStorage.setItem(localStorageKey, lng);
  }
};

export default languageDetector;
