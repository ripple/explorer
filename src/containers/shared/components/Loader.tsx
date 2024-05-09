import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import LoaderPath from '../images/xrp-loader.png'
import '../css/loader.scss'

export const Loader: FC<{ className?: string }> = ({ className }) => {
  const { t } = useTranslation()
  return (
    <div className={`loader ${className}`}>
      <img src={LoaderPath} alt={t('loading')} title="loader" />
    </div>
  )
}
