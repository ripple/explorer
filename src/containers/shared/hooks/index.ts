import { useTranslation } from 'react-i18next'

export * from './useLocalStorage'

export const useLanguage = () => useTranslation().i18n.resolvedLanguage
