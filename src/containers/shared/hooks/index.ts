import { useTranslation } from 'react-i18next'
import { useLocalStorage } from './useLocalStorage'

export * from './useLocalStorage'

export const useLanguage = () => useTranslation().i18n.resolvedLanguage

export const useCustomNetworks = () =>
  useLocalStorage<string[]>('explorer-custom-networks', [])
