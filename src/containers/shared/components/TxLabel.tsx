import React from 'react'
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
    <div className={`tx-label tx-type tx-category-${getCategory(type)}`}>
      <TransactionActionIcon type={type} />
      <span className="tx-type-name">{t([`transaction_${type}`, type])}</span>
    </div>
  )
}
