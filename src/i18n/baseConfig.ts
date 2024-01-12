import { InitOptions } from 'i18next'

export const supportedLanguages = {
  'en-US': 'English',
  'ja-JP': '日本語',
  'ko-KR': '한국어',
  'es-ES': 'Español',
  'fr-FR': 'Français',
}

export const options: InitOptions = {
  returnNull: false,
  debug: process.env.NODE_ENV === 'development',
  fallbackLng: 'en-US',
  ns: ['translations'], // have a common namespace used around the full app
  defaultNS: 'translations',
  keySeparator: false, // we use content as keys
  interpolation: {
    escapeValue: false, // not needed for react!!
    formatSeparator: ',',
  },
  supportedLngs: Object.keys(supportedLanguages),
  react: {
    useSuspense: true,
  },
  backend: {
    loadPath: '/locales/{{lng}}/{{ns}}.json',
  },
  load: 'currentOnly',
}
