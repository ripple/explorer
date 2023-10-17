import { useTranslation } from 'react-i18next'
import { useLanguage } from '../../shared/hooks'
import { Dropdown, DropdownItem } from '../../shared/components/Dropdown'
import './LanguagePicker.scss'
import { supportedLanguages } from '../../../i18n/baseConfig'

export const LanguagePicker = () => {
  const { t, i18n } = useTranslation()
  const currentLanguage = useLanguage()

  const handleLanguageClick = (language: string) => () => {
    i18n.changeLanguage(language)
  }

  return (
    <div className="language-picker">
      <Dropdown
        title={t(`language`, { context: currentLanguage, defaultValue: '' })}
        className="dropdown-right"
      >
        {Object.entries(supportedLanguages)
          .filter(([language]) => language !== currentLanguage)
          .map(([language, languageName]) => (
            <DropdownItem
              key={language}
              className={`language-picker-${language}`}
              handler={handleLanguageClick(language)}
            >
              {languageName}
            </DropdownItem>
          ))}
      </Dropdown>
    </div>
  )
}
