import { useTranslation } from 'react-i18next'
import { useLocalStorage } from './useLocalStorage'

export * from './useLocalStorage'

export const useLanguage = () =>
  useTranslation().i18n.resolvedLanguage || 'en-US'

export const CUSTOM_NETWORKS_STORAGE_KEY = 'explorer-custom-networks'

export const useCustomNetworks = () =>
  useLocalStorage<string[]>(CUSTOM_NETWORKS_STORAGE_KEY, [])
