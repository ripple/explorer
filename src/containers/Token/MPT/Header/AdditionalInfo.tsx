import { useTranslation } from 'react-i18next'

interface AdditionalInfoProps {
  additionalInfo: string | Record<string, unknown>
}

export const AdditionalInfo = ({
  additionalInfo,
}: AdditionalInfoProps): JSX.Element => {
  const { t } = useTranslation()

  const renderContent = () => {
    if (typeof additionalInfo === 'string') {
      return (
        <div className="header-box-item">
          <div className="item-value description-value">{additionalInfo}</div>
        </div>
      )
    }

    // It's an object - render key-value pairs
    return Object.entries(additionalInfo).map(([key, value]) => (
      <div className="header-box-item" key={key}>
        <div className="item-name">{key}</div>
        <div className="item-value">
          {typeof value === 'object' ? JSON.stringify(value) : String(value)}
        </div>
      </div>
    ))
  }

  return (
    <div className="header-box">
      <div className="header-box-title">{t('mpt_page.additional_info')}</div>
      <div className="header-box-contents">{renderContent()}</div>
    </div>
  )
}
