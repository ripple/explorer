import { Component } from 'react'
import { Link } from 'react-router-dom'
import { withTranslation } from 'react-i18next'
import PropTypes from 'prop-types'
import { CURRENCY_OPTIONS } from '../shared/transactionUtils'
import { localizeNumber } from '../shared/utils'
import Tooltip from '../shared/components/Tooltip'
import './css/ledgers.scss'
import DomainLink from '../shared/components/DomainLink'
import Loader from '../shared/components/Loader'
import SocketContext from '../shared/SocketContext'
import { getAction, getCategory } from '../shared/components/Transaction'
import { TransactionActionIcon } from '../shared/components/TransactionActionIcon/TransactionActionIcon'
import { Legend } from './Legend'
import { LedgerHashComponent } from './LedgerHashView'

class Ledgers extends Component {
  constructor(props) {
    super(props)
    this.state = {
      validators: {},
      tooltip: null,
    }
  }

  static getDerivedStateFromProps = (nextProps, prevState) => ({
    selected: nextProps.selected,
    validators: nextProps.validators,
    unlCount: nextProps.unlCount,
  })

  getMissingValidators = (hash) => {
    const { validators } = this.props
    const unl = {}

    Object.keys(validators).forEach((pubkey) => {
      if (validators[pubkey].unl) {
        unl[pubkey] = false
      }
    })

    hash.validations.forEach((v) => {
      if (unl[v.pubkey] !== undefined) {
        delete unl[v.pubkey]
      }
    })

    return Object.keys(unl).map((pubkey) => validators[pubkey])
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
    const url = `/validators/${selected}`
    return (
      <div className="selected-validator">
        {v.domain && <DomainLink domain={v.domain} />}
        <a className="pubkey" href={url}>
          {selected}
        </a>
      </div>
    )
  }

  renderLedger = (ledger) => {
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
            <LedgerHashComponent key={`${hash.hash}`} hash={hash} />
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
        <Link to={`/ledgers/${ledgerIndex}`}>{ledgerIndex}</Link>
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
    <Link
      key={tx.hash}
      className={`txn tx-type tx-dot bg tx-category-${getCategory(
        tx.type,
      )} tx-action-${getAction(tx.type)} ${tx.result}`}
      onMouseOver={(e) => this.showTooltip('tx', e, tx)}
      onFocus={(e) => {}}
      onMouseLeave={this.hideTooltip}
      to={`/transactions/${tx.hash}`}
    >
      <TransactionActionIcon type={tx.type} />
      <span>{tx.hash}</span>
    </Link>
  )

  renderTrustedCount = (hash) => {
    const { t } = this.props
    const { unlCount } = this.state
    const className = hash.trusted_count < unlCount ? 'missed' : null
    const missing =
      hash.trusted_count && className === 'missed'
        ? this.getMissingValidators(hash)
        : null

    return hash.trusted_count ? (
      <span
        tabIndex={0}
        role="button"
        className={className}
        onMouseMove={(e) =>
          missing &&
          missing.length &&
          this.showTooltip('missing', e, { missing })
        }
        onFocus={(e) => {}}
        onKeyUp={(e) => {}}
        onMouseLeave={this.hideTooltip}
      >
        <div>{t('unl')}:</div>
        <b>
          {hash.trusted_count}/{unlCount}
        </b>
      </span>
    ) : null
  }

  render() {
    const { selected, tooltip } = this.state
    const { ledgers, t, language } = this.props
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
  ledgers: PropTypes.shape({}), // eslint-disable-line
  validators: PropTypes.shape({}), // eslint-disable-line
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
