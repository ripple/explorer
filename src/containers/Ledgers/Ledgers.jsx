import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { withTranslation } from 'react-i18next'
import PropTypes from 'prop-types'
import { CURRENCY_OPTIONS } from '../shared/transactionUtils'
import { localizeNumber } from '../shared/utils'
import Tooltip from '../shared/components/Tooltip'
import './css/ledgers.scss'
import { ReactComponent as SuccessIcon } from '../shared/images/success.svg'

class Ledgers extends Component {
  constructor(props) {
    super(props)
    this.state = {
      ledgers: [],
      validators: {},
      tooltip: null,
    }
  }

  static getDerivedStateFromProps = (nextProps, prevState) => ({
    selected: nextProps.selected,
    ledgers: nextProps.paused ? prevState.ledgers : nextProps.ledgers,
    validators: nextProps.validators,
    unlCount: nextProps.unlCount,
  })

  setSelected = (pubkey) =>
    this.setState((prevState) => ({
      selected: prevState.selected === pubkey ? null : pubkey,
    }))

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
        x: event.pageX,
        y: event.pageY,
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
        <a
          className="domain"
          href={`https://${v.domain}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {v.domain}
        </a>
        <a className="pubkey" href={url}>
          {selected}
        </a>
      </div>
    )
  }

  renderLedger = (ledger) => {
    const time = ledger.close_time
      ? new Date(ledger.close_time).toLocaleTimeString()
      : null
    const transactions = ledger.transactions || []

    return (
      <div className="ledger" key={ledger.ledger_index}>
        <div className="ledger-head">
          {this.renderLedgerIndex(ledger.ledger_index)}
          <div className="close-time">{time}</div>
          {this.renderTxnCount(ledger.txn_count)}
          {this.renderFees(ledger.total_fees)}
          <div className="transactions">
            {transactions.map(this.renderTransaction)}
          </div>
        </div>
        <div className="hashes">{ledger.hashes.map(this.renderHash)}</div>
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
    return count ? (
      <div className="txn-count">
        {t('txn_count')}:<b>{count.toLocaleString()}</b>
      </div>
    ) : null
  }

  renderFees = (d) => {
    const { t, language } = this.props
    const options = { ...CURRENCY_OPTIONS, currency: 'XRP' }
    const amount = localizeNumber(d, language, options)
    return d ? (
      <div className="fees">
        {t('fees')}:<b>{amount}</b>
      </div>
    ) : null
  }

  renderTransaction = (tx) => (
    <Link
      key={tx.hash}
      className={`txn tx-type bg ${tx.type} ${tx.result}`}
      onMouseOver={(e) => this.showTooltip('tx', e, tx)}
      onFocus={(e) => {}}
      onMouseLeave={this.hideTooltip}
      to={`/transactions/${tx.hash}`}
      // rel="noopener noreferrer"
    >
      <span>{tx.hash}</span>
    </Link>
  )

  renderHash = (hash) => {
    const { t } = this.props
    const shortHash = hash.hash.substr(0, 6)
    const barStyle = { background: `#${shortHash}` }
    const validated = hash.validated && <SuccessIcon className="validated" />
    return (
      <div
        className={`hash ${hash.unselected ? 'unselected' : ''}`}
        key={hash.hash}
      >
        <div className="bar" style={barStyle} />
        <div className="ledger-hash">
          <div className="hash-concat">{hash.hash.substr(0, 6)}</div>
          {validated}
        </div>
        <div className="subtitle">
          <div className="validation-total">
            <div>{t('total')}:</div>
            <b>{hash.validations.length}</b>
          </div>
          {this.renderTrustedCount(hash)}
        </div>
        <div className="validations">
          {hash.validations.map(this.renderValidator)}
        </div>
      </div>
    )
  }

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

  renderValidator = (v, i) => {
    const { setSelected } = this.props
    const { selected: selectedState } = this.state
    const trusted = v.unl ? 'trusted' : ''
    const unselected = selectedState ? 'unselected' : ''
    const selected = selectedState === v.pubkey ? 'selected' : ''
    const className = `validation ${trusted} ${unselected} ${selected} ${v.pubkey}`
    const partial = v.partial ? <div className="partial" /> : null
    return (
      <div
        key={v.pubkey}
        role="button"
        tabIndex={i}
        className={className}
        onMouseOver={(e) => this.showTooltip('validator', e, v)}
        onFocus={(e) => {}}
        onKeyUp={(e) => {}}
        onMouseLeave={this.hideTooltip}
        onClick={() => setSelected(v.pubkey)}
      >
        {partial}
      </div>
    )
  }

  render() {
    const { ledgers, selected, tooltip } = this.state
    const { t, language } = this.props
    return (
      <>
        <div className="ledgers">
          <div className="control">{selected && this.renderSelected()}</div>
          <div className="ledger-line" />
          <div className="ledger-list">{ledgers.map(this.renderLedger)}</div>
        </div>
        <Tooltip t={t} language={language} data={tooltip} />
      </>
    )
  }
}

Ledgers.propTypes = {
  ledgers: PropTypes.arrayOf(PropTypes.shape({})), // eslint-disable-line
  validators: PropTypes.shape({}), // eslint-disable-line
  unlCount: PropTypes.number, // eslint-disable-line
  selected: PropTypes.string, // eslint-disable-line
  setSelected: PropTypes.func,
  language: PropTypes.string.isRequired,
  t: PropTypes.func.isRequired,
  paused: PropTypes.bool,
}

Ledgers.defaultProps = {
  ledgers: [],
  validators: {},
  unlCount: 0,
  selected: null,
  setSelected: () => {},
  paused: false,
}

export default withTranslation()(Ledgers)
