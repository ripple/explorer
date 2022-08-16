import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import Loader from '../shared/components/Loader'
import { ReactComponent as SuccessIcon } from '../shared/images/success.svg'
import infoOrange from '../shared/images/info_orange.png'
import './css/validatorsTable.scss'

class ValidatorsTable extends Component {
  static getDerivedStateFromProps(nextProps, prevState) {
    return nextProps.validators
      ? {
          validators: ValidatorsTable.sortValidators(nextProps.validators),
          metrics: nextProps.metrics,
        }
      : null
  }

  static sortValidators = (data) => {
    data.sort((a, b) => {
      const aUnl = a.unl || 'zzz'
      const bUnl = b.unl || 'zzz'
      const aDomain = a.domain || 'zzz'
      const bDomain = b.domain || 'zzz'
      const aScore = a.agreement_30day ? a.agreement_30day.score : -1
      const bScore = b.agreement_30day ? b.agreement_30day.score : -1
      const aPubkey = a.master_key || a.signing_key
      const bPubkey = b.master_key || b.signing_key

      // 1. Sort by whether the validator is on the UNL
      if (aUnl > bUnl) return 1
      if (aUnl < bUnl) return -1
      // 2. Sort by the 30 day score (descending)
      if (aScore < bScore) return 1
      if (aScore > bScore) return -1
      // 3. Sort alphabetically by the domain
      if (aDomain > bDomain) return 1
      if (aDomain < bDomain) return -1
      // 4. Sort alphabetically by the public key
      if (aPubkey > bPubkey) return 1
      if (aPubkey < bPubkey) return -1

      return 0
    })

    return data
  }

  constructor(props) {
    super(props)
    this.state = {}
  }

  static renderDomain = (domain) =>
    domain && (
      <a href={`https://${domain}`} target="_blank" rel="noopener noreferrer">
        {domain}
      </a>
    )

  renderAgreement = (className, d) => {
    const { t } = this.props

    return d ? (
      <td
        className={`${className} score ${d.score < 1 ? 'missed' : ''}`}
        title={t('missed_validations', { count: d.missed })}
      >
        {Number.parseFloat(d.score).toFixed(5)}
        {d.incomplete && <span title={t('incomplete')}>*</span>}
      </td>
    ) : (
      <td />
    )
  }

  renderValidator = (d) => {
    const { metrics } = this.state
    const color = d.ledger_hash ? `#${d.ledger_hash.substr(0, 6)}` : ''
    const trusted = d.unl ? 'yes' : 'no'
    const pubkey = d.master_key || d.signing_key
    const onNegativeUnl = metrics.nUnl && metrics.nUnl.includes(pubkey)
    const nUnl = onNegativeUnl ? 'yes' : 'no'

    return (
      <tr key={pubkey}>
        <td className="pubkey text-truncate" title={pubkey}>
          <Link to={`/validators/${pubkey}`}>{pubkey}</Link>
        </td>
        <td className="domain text-truncate">
          {ValidatorsTable.renderDomain(d.domain)}
        </td>
        <td className={`unl ${trusted}`}>
          {d.unl && <SuccessIcon title={d.unl} alt={d.unl} />}
        </td>
        <td className={`n-unl ${nUnl}`}>
          {onNegativeUnl && <img src={infoOrange} title={d.unl} alt={d.unl} />}
        </td>
        {this.renderAgreement('h1', d.agreement_1hour)}
        {this.renderAgreement('h24', d.agreement_24hour)}
        {this.renderAgreement('d30', d.agreement_30day)}
        <td className="fee">
          {d.load_fee ? `x${(d.load_fee / 256).toFixed(3)}` : ''}
        </td>
        <td
          className="last-ledger"
          style={{ color }}
          title={d.partial ? 'partial validation' : undefined}
        >
          <Link to={`/ledgers/${d.ledger_index}`}>{d.ledger_index}</Link>
          {d.partial && '*'}
        </td>
      </tr>
    )
  }

  render() {
    const { t } = this.props
    const { validators } = this.state
    const content = validators ? (
      <table className="basic">
        <thead>
          <tr>
            <th className="pubkey">{t('pubkey')}</th>
            <th className="domain">{t('domain')}</th>
            <th className="unl">{t('unl')}</th>
            <th className="n-unl">{t('nUnlCol')}</th>
            <th className="score h1">{t('1H')}</th>
            <th className="score h24">{t('24H')}</th>
            <th className="score d30">{t('30D')}</th>
            <th className="fee">{t('fee')}</th>
            <th className="last-ledger">{t('ledger')}</th>
          </tr>
        </thead>
        <tbody>{validators.map(this.renderValidator)}</tbody>
      </table>
    ) : (
      <Loader />
    )

    return <div className="validators-table">{content}</div>
  }
}

ValidatorsTable.propTypes = {
  validators: PropTypes.arrayOf(PropTypes.shape({})), // eslint-disable-line
  t: PropTypes.func.isRequired,
  metrics: PropTypes.shape({}).isRequired,
}

ValidatorsTable.defaultProps = {
  validators: null,
}

export default withTranslation()(ValidatorsTable)
