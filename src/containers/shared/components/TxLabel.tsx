import { useTranslation } from 'react-i18next'
import '../css/txlabel.scss'

interface Props {
  type: string
}

export const TxLabel = (props: Props) => {
  const { t } = useTranslation()
  const { type } = props
  return (
    <div className={`tx-label tx-type ${type}`}>
      <div>{t(`transaction_${type}`)}</div>
    </div>
  )
}
