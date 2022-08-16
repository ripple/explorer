import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import TransactionMeta from './Meta'
import TransactionDescription from './Description'
import Account from '../shared/components/Account'
import { localizeDate, localizeNumber } from '../shared/utils'
import {
  DATE_OPTIONS,
  CURRENCY_OPTIONS,
  SUCCESSFULL_TRANSACTION,
  XRP_BASE,
  buildFlags,
  buildMemos,
} from '../shared/transactionUtils'
import './detailTab.scss'

class DetailTab extends Component {
  renderStatus() {
    const { t, language, data } = this.props
    const { TransactionResult } = data.meta
    const time = localizeDate(new Date(data.date), language, DATE_OPTIONS)
    let line1

    if (TransactionResult === SUCCESSFULL_TRANSACTION) {
      line1 = t('successful_transaction')
    } else {
      line1 = (
        <>
          {t('fail_transaction')}
          <span className="tx-result fail">{TransactionResult}</span>
        </>
      )
    }

    return (
      <div className="section">
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

  renderMemos() {
    const { t, data } = this.props
    const memos = buildMemos(data)
    return memos.length ? (
      <div className="section">
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

  renderFee() {
    const { t, data, language } = this.props
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
        <div className="section">
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

  renderFlags() {
    const { t, data } = this.props
    const flags = buildFlags(data)
    return flags.length ? (
      <div className="section">
        <div className="title">{t('flags')}</div>
        <div className="flags">
          {flags.map((flag) => (
            <div key={flag}>{flag}</div>
          ))}
        </div>
      </div>
    ) : null
  }

  renderSigners() {
    const { t, data } = this.props
    return data.tx.Signers ? (
      <div className="section">
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
  }

  render() {
    const { t, language, data, instructions } = this.props
    return (
      <div className="detail-body">
        {this.renderStatus()}
        <TransactionDescription
          t={t}
          language={language}
          data={data}
          instructions={instructions}
        />
        {this.renderSigners()}
        {this.renderFlags()}
        {this.renderFee()}
        {this.renderMemos()}
        <TransactionMeta t={t} language={language} data={data} />
      </div>
    )
  }
}

DetailTab.propTypes = {
  t: PropTypes.func.isRequired,
  language: PropTypes.string.isRequired,
  data: PropTypes.objectOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object,
      PropTypes.number,
      PropTypes.array,
    ]),
  ).isRequired,
  instructions: PropTypes.shape({}).isRequired,
}

export default DetailTab
