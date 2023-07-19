import i18n from 'i18next'
import { options } from './baseConfig'
import { configureFormatters } from './formatters'

i18n.init({
  ...options,
  fallbackLng: 'cimode',
  debug: false,
  react: {
    useSuspense: false,
  },
})

configureFormatters(i18n)

export default i18n
