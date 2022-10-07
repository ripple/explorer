import React from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import TxLabel from '../TxLabel'
import { ReactComponent as SuccessIcon } from '../../images/success.svg'
import { ReactComponent as FailIcon } from '../../images/ic_fail.svg'
import TxDetails from '../TxDetails'
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
  const { t, i18n } = useTranslation()
  const success = tx.result === 'tesSUCCESS'
  const date = localizeDate(new Date(tx.date), language, DATE_OPTIONS)
  const status = success ? 'Success' : `Fail - ${tx.result}`

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
          <span
            title={tx.result}
            className={`tx-result ${success ? 'success' : 'fail'}`}
          >
            {success ? (
              <SuccessIcon className="successful" title={t('success')} />
            ) : (
              <FailIcon className="failed" title={t('fail')} />
            )}
            <span className="status">{status}</span>
          </span>
        </div>
        <div className="col-date">{date}</div>
      </div>
      {tx.details && (
        <div className="details">
          <TxDetails
            language={i18n.resolvedLanguage}
            type={tx.type}
            instructions={tx.details.instructions}
          />
        </div>
      )}
    </li>
  )
}
