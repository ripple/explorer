import PropTypes from 'prop-types'
import { Trans, useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { TransactionMeta } from './Meta'
import { TransactionDescription } from './Description'
import { Account } from '../shared/components/Account'
import { localizeDate, localizeNumber } from '../shared/utils'
import {
  DATE_OPTIONS,
  CURRENCY_OPTIONS,
  SUCCESSFUL_TRANSACTION,
  XRP_BASE,
  buildFlags,
  buildMemos,
} from '../shared/transactionUtils'
import './detailTab.scss'
import { useLanguage } from '../shared/hooks'

const DetailTab = ({ data }) => {
  const { t } = useTranslation()
  const language = useLanguage()

  const renderStatus = () => {
    const { TransactionResult } = data.meta
    const time = localizeDate(new Date(data.date), language, DATE_OPTIONS)
    let line1

    if (TransactionResult === SUCCESSFUL_TRANSACTION) {
      line1 = t('successful_transaction')
    } else {
      line1 = (
        <Trans i18nKey="fail_transaction" values={{ code: TransactionResult }}>
          <span className="tx-result fail" />
        </Trans>
      )
    }

    return (
      <div className="detail-section" data-test="status">
        <div className="title">{t('status')}</div>
        {line1}
        {t('transaction_validated')}
        <Link className="ledger" to={`/ledgers/${data.ledger_index}`}>
          {data.ledger_index}
        </Link>
        {t('on')}
        <span className="time">{`${time} ${DATE_OPTIONS.timeZone}`}</span>
      </div>
    )
  }

  const renderMemos = () => {
    const memos = buildMemos(data)
    return memos.length ? (
      <div className="detail-section">
        <div className="title">
          {t('memos')}
          <span>({t('decoded_hex')})</span>
        </div>
        {memos.map((memo) => (
          <div key={memo}>{memo}</div>
        ))}
      </div>
    ) : null
  }

  const renderFee = () => {
    const numberOptions = { ...CURRENCY_OPTIONS, currency: 'XRP' }
    const totalCost = data.tx.Fee
      ? localizeNumber(
          Number.parseFloat(data.tx.Fee) / XRP_BASE,
          language,
          numberOptions,
        )
      : null
    return (
      totalCost && (
        <div className="detail-section">
          <div className="title transaction-cost">{t('transaction_cost')}</div>
          <div>
            {t('transaction_consumed_fee')}
            <b>
              <span> {totalCost}</span>
              <small>XRP</small>
            </b>
          </div>
        </div>
      )
    )
  }

  const renderFlags = () => {
    const flags = buildFlags(data)
    return flags.length ? (
      <div className="detail-section">
        <div className="title">{t('flags')}</div>
        <div className="flags">
          {flags.map((flag) => (
            <div key={flag}>{flag}</div>
          ))}
        </div>
      </div>
    ) : null
  }

  const renderSigners = () =>
    data.tx.Signers ? (
      <div className="detail-section">
        <div className="title">{t('signers')}</div>
        <ul className="signers">
          {data.tx.Signers.map((d, i) => (
            <li key={d.Signer.Account}>
              <Account account={d.Signer.Account} />
            </li>
          ))}
        </ul>
      </div>
    ) : null

  return (
    <div className="detail-body">
      {renderStatus()}
      <TransactionDescription data={data} />
      {renderSigners()}
      {renderFlags()}
      {renderFee()}
      {renderMemos()}
      <TransactionMeta data={data} />
    </div>
  )
}

DetailTab.propTypes = {
  data: PropTypes.objectOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object,
      PropTypes.number,
      PropTypes.array,
    ]),
  ).isRequired,
}

export default DetailTab
