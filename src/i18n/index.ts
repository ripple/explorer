import i18n from 'i18next'
import Backend from 'i18next-http-backend'
import LanguageDetector from 'i18next-browser-languagedetector'
import { configureFormatters } from './formatters'
import { options } from './baseConfig'

i18n
  .use(Backend)
  .use(LanguageDetector)
  .init({ ...options, detector: { excludeCacheFor: [] } } as any)
configureFormatters(i18n)

export default i18n
