import { useTranslation } from 'react-i18next';

export const useLanguage = () => {
  return useTranslation().i18n.resolvedLanguage;
};
