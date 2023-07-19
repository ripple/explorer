import i18n from './testConfig'
import translations from '../../public/locales/en-US/translations.json'

// Configuration which hardcodes translation to english which helps with complex interpolations
// This is in a separate file until all tests can be switched over
i18n.init({
  lng: 'en-US',
  resources: {
    'en-US': {
      translations,
    },
  },
})

export default i18n
