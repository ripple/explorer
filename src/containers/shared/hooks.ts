import { useTranslation } from 'react-i18next'

export const useLanguage = () => useTranslation().i18n.resolvedLanguage;

