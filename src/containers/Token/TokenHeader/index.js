import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { withTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { loadTokenState } from './actions'
import Loader from '../../shared/components/Loader'
import '../../shared/css/nested-menu.scss'
import './styles.scss'
import { localizeNumber, formatLargeNumber } from '../../shared/utils'
import SocketContext from '../../shared/SocketContext'
import Currency from '../../shared/components/Currency'
import { Account } from '../../shared/components/Account'
import DomainLink from '../../shared/components/DomainLink'
import { TokenTableRow } from '../../shared/components/TokenTableRow'

const CURRENCY_OPTIONS = {
  style: 'currency',
  currency: 'XRP',
  minimumFractionDigits: 2,
  maximumFractionDigits: 6,
}

class TokenHeader extends Component {
  componentDidMount() {
    const { actions, accountId, currency } = this.props
    const rippledSocket = this.context
    actions.loadTokenState(currency, accountId, rippledSocket)
  }

  componentDidUpdate(prevProps) {
    const nextAccountId = prevProps.accountId
    const nextCurrency = prevProps.currency
    const { accountId, currency, actions } = this.props
    const rippledSocket = this.context

    if (nextAccountId !== accountId || nextCurrency !== currency) {
      actions.loadTokenState(nextCurrency, nextAccountId, rippledSocket)
    }
  }

  renderDetails() {
    const { t, data } = this.props
    const { domain, rate, emailHash, previousLedger, previousTxn } = data

    const prevTxn = previousTxn && previousTxn.replace(/(.{20})..+/, '$1...')
    const abbrvEmail = emailHash && emailHash.replace(/(.{20})..+/, '$1...')
    return (
      <table className="token-table">
        <tbody>
          <TokenTableRow
            shouldDisplay={!!domain}
            label={t('domain')}
            value={<DomainLink domain={domain} />}
          />
          <TokenTableRow
            shouldDisplay={!!rate}
            label="Fee Rate"
            value={`${rate * 100}%`}
          />
          <TokenTableRow
            label={t('last_ledger')}
            value={
              <Link to={`/ledgers/${previousLedger}`}>{previousLedger}</Link>
            }
          />
          <TokenTableRow
            label="Last affecting tx"
            value={<Link to={`/transactions/${previousTxn}`}>{prevTxn}</Link>}
          />
          <TokenTableRow
            shouldDisplay={!!emailHash}
            label={t('email_hash')}
            value={abbrvEmail}
          />
        </tbody>
      </table>
    )
  }

  renderSettings() {
    const { data } = this.props
    const { flags } = data

    const rippling =
      flags && flags.includes('lsfDefaultRipple') ? 'enabled' : 'disabled'
    const depositAuth =
      flags && flags.includes('lsfDepositAuth') ? 'enabled' : 'disabled'
    const masterKey =
      flags && flags.includes('lsfDisableMaster') ? 'disabled' : 'enabled'
    const receivingXRP =
      flags && flags.includes('lsfDisallowXRP') ? 'disabled' : 'enabled'
    const frozen = flags && flags.includes('lsfGlobalFreeze') ? 'true' : 'false'
    const noFreeze = flags && flags.includes('lsfNoFreeze') ? 'true' : 'false'
    const requireAuth =
      flags && flags.includes('lsfRequireAuth') ? 'true' : 'false'
    const requireDestTag =
      flags && flags.includes('lsfRequireDestTag') ? 'true' : 'false'

    return (
      <table className="token-table">
        <tbody>
          <TokenTableRow label="Rippling" value={rippling} />
          <TokenTableRow label="Deposit Auth" value={depositAuth} />
          <TokenTableRow label="Master Key" value={masterKey} />
          <TokenTableRow label="Receiving XRP" value={receivingXRP} />
          <TokenTableRow label="Frozen" value={frozen} />
          <TokenTableRow label="No freeze" value={noFreeze} />
          <TokenTableRow label="Require Auth" value={requireAuth} />
          <TokenTableRow label="Require Dest Tag" value={requireDestTag} />
        </tbody>
      </table>
    )
  }

  renderHeaderContent() {
    const { t, data, language, accountId } = this.props
    const { balance, sequence, obligations, reserve } = data
    const currencyBalance = localizeNumber(
      balance / 1000000 || 0.0,
      language,
      CURRENCY_OPTIONS,
    )
    const reserveBalance = localizeNumber(
      reserve || 0.0,
      language,
      CURRENCY_OPTIONS,
    )
    const obligationsBalance = formatLargeNumber(Number.parseFloat(obligations))

    return (
      <div className="section header-container">
        <div className="info-container">
          <div className="values">
            <div className="title">{t('accounts.xrp_balance')}</div>
            <div className="value">{currencyBalance}</div>
          </div>
          <div className="values">
            <div className="title">{t('reserve')}</div>
            <div className="value">{reserveBalance}</div>
          </div>
          <div className="values">
            <div className="title">{t('sequence_number_short')}</div>
            <div className="value">{sequence}</div>
          </div>
          <div className="values">
            <div className="title">{t('issuer_address')}</div>
            <div className="value">
              <Account account={accountId} />
            </div>
          </div>
          <div className="values">
            <div className="title">{t('obligations')}</div>
            <div className="value">
              {obligationsBalance.num}
              {obligationsBalance.unit}
            </div>
          </div>
        </div>
        <div className="bottom-container">
          <div className="details">
            <h2>{t('details')}</h2>
            {this.renderDetails()}
          </div>
          <div className="settings">
            <h2 className="title">{t('settings')}</h2>
            {this.renderSettings()}
          </div>
        </div>
      </div>
    )
  }

  render() {
    const { currency, loading, data } = this.props
    const { gravatar } = data
    return (
      <div className="box token-header">
        <div className="section box-header">
          <Currency currency={currency} />
          {gravatar && <img alt={`${currency} logo`} src={gravatar} />}
        </div>
        <div className="box-content">
          {loading ? <Loader /> : this.renderHeaderContent()}
        </div>
      </div>
    )
  }
}

TokenHeader.contextType = SocketContext

TokenHeader.propTypes = {
  language: PropTypes.string.isRequired,
  t: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  accountId: PropTypes.string.isRequired,
  currency: PropTypes.string.isRequired,
  data: PropTypes.shape({
    balance: PropTypes.string,
    reserve: PropTypes.number,
    sequence: PropTypes.number,
    rate: PropTypes.number,
    obligations: PropTypes.string,
    domain: PropTypes.string,
    emailHash: PropTypes.string,
    gravatar: PropTypes.string,
    previousLedger: PropTypes.number,
    previousTxn: PropTypes.string,
    paychannels: PropTypes.shape({
      total_available: PropTypes.string,
      channels: PropTypes.shape({
        length: PropTypes.number,
      }),
    }),
    escrows: PropTypes.shape({
      totalIn: PropTypes.number,
      totalOut: PropTypes.number,
    }),
    signerList: PropTypes.shape({
      signers: PropTypes.shape({
        map: PropTypes.func,
      }),
      quorum: PropTypes.number,
      maxSigners: PropTypes.number,
    }),
    flags: PropTypes.arrayOf(PropTypes.string),
    xAddress: PropTypes.shape({
      classicAddress: PropTypes.string,
      tag: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]),
      test: PropTypes.bool,
    }),
  }).isRequired,
  actions: PropTypes.shape({
    loadTokenState: PropTypes.func.isRequired,
  }).isRequired,
}

export default connect(
  (state) => ({
    language: state.app.language,
    loading: state.tokenHeader.loading,
    data: state.tokenHeader.data,
  }),
  (dispatch) => ({
    actions: bindActionCreators(
      {
        loadTokenState,
      },
      dispatch,
    ),
  }),
)(withTranslation()(TokenHeader))
