import i18n from 'i18next'

i18n.init({
  fallbackLng: 'cimode',
  debug: false,
  saveMissing: false,

  interpolation: {
    escapeValue: false, // not needed for react!!
  },

  // react i18next special options (optional)
  react: {
    nsMode: 'fallback', // set it to fallback to let passed namespaces to translated hoc act as fallbacks
    useSuspense: false,
  },
})

export default i18n
