import { useTranslation } from 'react-i18next'
import '../css/txlabel.scss'
import { TransactionActionIcon } from './TransactionActionIcon/TransactionActionIcon'
import { getCategory } from './Transaction'

interface Props {
  type: string
}

export const TxLabel = (props: Props) => {
  const { t } = useTranslation()
  const { type } = props
  return (
    <div
      className={`tx-label tx-type tx-category-${getCategory(type)}`}
      title="tx-label"
    >
      <TransactionActionIcon type={type} />
      <span className="tx-type-name">
        {t(`transaction_type_name`, { context: type, defaultValue: type })}
      </span>
    </div>
  )
}
