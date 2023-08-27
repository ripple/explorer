import { useTranslation } from 'react-i18next'
import { useLanguage } from '../../shared/hooks'
import { Dropdown, DropdownItem } from '../../shared/components/Dropdown'
import './LanguagePicker.scss'
import { supportedLanguages } from '../../../i18n/baseConfig'

export const LanguagePicker = () => {
  const {t, i18n } = useTranslation()
  const currentLanguage = useLanguage();


  let lang:String;
  if(currentLanguage=='en-US'){
    lang  = "English";
  }else if(currentLanguage =='ja-JP'){
    lang = "Japanese";
  }else{
    lang = "Korean";
  }

  const handleLanguageClick = (language: string) => () => {
    i18n.changeLanguage(language)
  }

  return (
    <div className="language-picker">
      <Dropdown
        title={t(`language`, { context: currentLanguage, defaultValue: '' })}
        className="dropdown-right"
      >
        {supportedLanguages
          .filter((language) => language !== currentLanguage)
          .map((language) => (

            <DropdownItem
              key={language}
              className={`language-picker-${language}`}
              handler={handleLanguageClick(language)}
            >
             {t(`language`, {
                context: language,
                defaultValue: '',
              })}
            </DropdownItem>
          ))}
      </Dropdown>
    </div>
  )
}
