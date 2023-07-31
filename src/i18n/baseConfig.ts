import { InitOptions } from 'i18next'

export const supportedLanguages = ['en-US', 'ja-JP', 'fr-FR']

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
  supportedLngs: supportedLanguages,
  react: {
    useSuspense: true,
  },
  backend: {
    loadPath: '/locales/{{lng}}/{{ns}}.json',
  },
  load: 'currentOnly',
}
