import React from 'react'
import { useTranslation } from 'react-i18next'
import '../css/txlabel.scss'
import { TransactionActionIcon } from './TransactionActionIcon/TransactionActionIcon'
import { transactionTypes } from './Transaction'

interface Props {
  type: string
}

export const TxLabel = (props: Props) => {
  const { t } = useTranslation()
  const { type } = props
  return (
    <div
      className={`tx-label tx-type tx-category-${transactionTypes[type].category}`}
    >
      <TransactionActionIcon type={type} />
      <span className="tx-type-name">{t(`transaction_${type}`)}</span>
    </div>
  )
}
