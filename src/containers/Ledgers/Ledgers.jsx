import { Component } from 'react'
import { withTranslation } from 'react-i18next'
import PropTypes from 'prop-types'
import { CURRENCY_OPTIONS } from '../shared/transactionUtils'
import { localizeNumber } from '../shared/utils'
import Tooltip from '../shared/components/Tooltip'
import './css/ledgers.scss'
import DomainLink from '../shared/components/DomainLink'
import { Loader } from '../shared/components/Loader'
import SocketContext from '../shared/SocketContext'
import { getAction, getCategory } from '../shared/components/Transaction'
import { TransactionActionIcon } from '../shared/components/TransactionActionIcon/TransactionActionIcon'
import { Legend } from './Legend'
import { LedgerHashComponent } from './LedgerHashView'
import { RouteLink } from '../shared/routing'
import { LEDGER_ROUTE, TRANSACTION_ROUTE, VALIDATOR_ROUTE } from '../App/routes'

class Ledgers extends Component {
  constructor(props) {
    super(props)
    this.state = {
      validators: {},
      tooltip: null,
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    return {
      selected: nextProps.selected,
      validators: nextProps.validators,
      unlCount: nextProps.unlCount,
    }
  }

  showTooltip = (mode, event, data) => {
    const { validators } = this.state
    this.setState({
      tooltip: {
        ...data,
        mode,
        v: mode === 'validator' && validators[data.pubkey],
        x: event.currentTarget.offsetLeft,
        y: event.currentTarget.offsetTop,
      },
    })
  }

  hideTooltip = () => this.setState({ tooltip: null })

  renderSelected = () => {
    const { validators, selected } = this.state
    const v = validators[selected] || {}
    return (
      <div className="selected-validator">
        {v.domain && <DomainLink domain={v.domain} />}
        <RouteLink
          to={VALIDATOR_ROUTE}
          params={{ identifier: selected }}
          className="pubkey"
        >
          {selected}
        </RouteLink>
      </div>
    )
  }

  renderLedger = (ledger) => {
    const { unlCount } = this.state
    const { vhsData } = this.props
    const time = ledger.closeTime
      ? new Date(ledger.closeTime).toLocaleTimeString()
      : null
    const transactions = ledger.transactions || []

    return (
      <div className="ledger" key={ledger.index}>
        <div className="ledger-head">
          {this.renderLedgerIndex(ledger.index)}
          <div className="close-time">{time}</div>
          {this.renderTxnCount(ledger.txCount)}
          {this.renderFees(ledger.totalFee)}
          <div className="transactions">
            {transactions.map(this.renderTransaction)}
          </div>
        </div>
        <div className="hashes">
          {ledger.hashes.map((hash) => (
            <LedgerHashComponent
              key={`${hash.hash}`}
              hash={hash}
              unlValidators={vhsData.filter((validation) => validation.unl)}
              unlCount={unlCount}
              vhsData={vhsData}
            />
          ))}
        </div>
      </div>
    )
  }

  renderLedgerIndex = (ledgerIndex) => {
    const { t } = this.props
    const flagLedger = ledgerIndex % 256 === 0
    return (
      <div
        className={`ledger-index ${flagLedger ? 'flag-ledger' : ''}`}
        title={flagLedger ? t('flag_ledger') : ''}
      >
        <RouteLink to={LEDGER_ROUTE} params={{ identifier: ledgerIndex }}>
          {ledgerIndex}
        </RouteLink>
      </div>
    )
  }

  renderTxnCount = (count) => {
    const { t } = this.props
    return count !== undefined ? (
      <div className="txn-count">
        {t('txn_count')}:<b>{count.toLocaleString()}</b>
      </div>
    ) : null
  }

  renderFees = (d) => {
    const { t, language } = this.props
    const options = { ...CURRENCY_OPTIONS, currency: 'XRP' }
    const amount = localizeNumber(d, language, options)
    return d !== undefined ? (
      <div className="fees">
        {t('fees')}:<b>{amount}</b>
      </div>
    ) : null
  }

  renderTransaction = (tx) => (
    <RouteLink
      key={tx.hash}
      className={`txn tx-type tx-dot bg tx-category-${getCategory(
        tx.type,
      )} tx-action-${getAction(tx.type)} ${tx.result}`}
      onMouseOver={(e) => this.showTooltip('tx', e, tx)}
      onFocus={(e) => {}}
      onMouseLeave={this.hideTooltip}
      to={TRANSACTION_ROUTE}
      params={{ identifier: tx.hash }}
    >
      <TransactionActionIcon type={tx.type} />
      <span>{tx.hash}</span>
    </RouteLink>
  )

  render() {
    const { selected, tooltip } = this.state
    const { ledgers, t, language } = this.props
    // eslint-disable-next-line react/destructuring-assignment -- this is clearer
    const isOnline = this.context.getState().online

    return (
      <div className="ledgers">
        {isOnline ? (
          <>
            <Legend />
            <div className="control">{selected && this.renderSelected()}</div>
            <div className="ledger-list">
              {Object.values(ledgers)
                .reverse()
                .slice(0, 20)
                .map(this.renderLedger)}{' '}
              <Tooltip t={t} language={language} data={tooltip} />
            </div>{' '}
          </>
        ) : (
          <Loader />
        )}
      </div>
    )
  }
}

Ledgers.contextType = SocketContext

Ledgers.propTypes = {
  ledgers: PropTypes.arrayOf(PropTypes.shape({})), // eslint-disable-line
  validators: PropTypes.shape({}), // eslint-disable-line
  vhsData: PropTypes.shape([]), // eslint-disable-line
  unlCount: PropTypes.number, // eslint-disable-line
  selected: PropTypes.string, // eslint-disable-line
  language: PropTypes.string.isRequired,
  t: PropTypes.func.isRequired,
}

Ledgers.defaultProps = {
  ledgers: {},
  validators: {},
  unlCount: 0,
  selected: null,
}

export default withTranslation()(Ledgers)
