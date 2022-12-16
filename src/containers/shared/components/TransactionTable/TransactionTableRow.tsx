import React from 'react'
import { Link } from 'react-router-dom'
import { TxLabel } from '../TxLabel'
import { TxStatus } from '../TxStatus'
import { TxDetails } from '../TxDetails'
import { localizeDate } from '../../utils'
import './styles.scss'
import { useLanguage } from '../../hooks'

const TIME_ZONE = 'UTC'
const DATE_OPTIONS = {
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric',
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  hour12: true,
  timeZone: TIME_ZONE,
}

interface Props {
  tx: any
}

export const TransactionTableRow = ({ tx }: Props) => {
  const language = useLanguage()
  const success = tx.result === 'tesSUCCESS'
  const date = localizeDate(new Date(tx.date), language, DATE_OPTIONS)

  return (
    <li
      className={`transaction-li anchor-mask tx-type ${tx.type} ${
        success ? 'success' : 'fail'
      }`}
    >
      <Link to={`/transactions/${tx.hash}`} className="mask-overlay" />
      <div className="upper">
        <div className="col-account">
          <div className="transaction-address" title={tx.account}>
            {tx.account}
          </div>
        </div>
        <div className={`col-type tx-type ${tx.type}`}>
          <TxLabel type={tx.type} />
        </div>
        <div className="col-status">
          <TxStatus status={tx.result} />
        </div>
        <div className="col-date">{date}</div>
      </div>
      {tx.details && (
        <div className="details">
          <TxDetails type={tx.type} instructions={tx.details.instructions} />
        </div>
      )}
    </li>
  )
}
