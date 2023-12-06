import { Component } from 'react'
import PropTypes from 'prop-types'
import successIcon from '../images/success.png'
import { localizeDate } from '../utils'
import '../css/tooltip.scss'
import PayStringToolTip from '../images/paystring_tooltip.svg'
import { TxStatus } from './TxStatus'
import { TxLabel } from './TxLabel'

const PADDING_Y = 20
const DATE_OPTIONS = {
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric',
  hour12: true,
}

class Tooltip extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  static getDerivedStateFromProps(nextProps) {
    return nextProps.data || { mode: null }
  }

  renderNegativeUnlTooltip() {
    const { nUnl } = this.state
    const list = nUnl.map((key) => {
      const short = key.substr(0, 8)
      return <div key={key} className={`nUnl: ${key}`}>{`${short}...`}</div>
    })

    return list
  }

  renderValidatorTooltip() {
    const { language } = this.props
    const { validation = {}, pubkey, time } = this.state
    const key = validation.master_key || pubkey

    return (
      <>
        <div className="domain">{validation.domain}</div>
        <div className="pubkey">{key}</div>
        <div className="time">{localizeDate(time, language, DATE_OPTIONS)}</div>
        {validation.unl && (
          <div className="unl">
            {validation.unl}
            <img src={successIcon} alt={validation.unl} />
          </div>
        )}
      </>
    )
  }

  renderTxTooltip() {
    const { type, result, account } = this.state
    return (
      <>
        <div className={`tx-type ${type}`}>
          <TxLabel type={type} /> <TxStatus status={result} shorthand />
        </div>
        <div className="account">{account}</div>
      </>
    )
  }

  renderMissingValidators() {
    const { missing } = this.state
    const { t } = this.props
    const list = missing.map((d) => (
      <div className={d.domain ? 'domain' : 'pubkey'} key={d.master_key}>
        {d.domain || d.master_key}
      </div>
    ))

    return (
      <>
        <div className="label">{t('missing')}:</div>
        {list}
      </>
    )
  }

  renderNFTId() {
    const { tokenId } = this.state
    return <div className="nft">{tokenId}</div>
  }

  renderPayStringToolTip() {
    const { t } = this.props

    return (
      <>
        <PayStringToolTip className="paystring-logo" alt="" />
        {t('paystring_explainer_blurb')}
      </>
    )
  }

  render() {
    const { mode, x, y } = this.state
    const style = { top: y + PADDING_Y, left: x }
    let content = null
    let className = 'tooltip'
    if (mode === 'validator') {
      content = this.renderValidatorTooltip()
    } else if (mode === 'tx') {
      content = this.renderTxTooltip()
    } else if (mode === 'nUnl') {
      content = this.renderNegativeUnlTooltip()
    } else if (mode === 'missing') {
      style.background = 'rgba(120,0,0,.9)'
      content = this.renderMissingValidators()
    } else if (mode === 'paystring') {
      className += ' paystring'
      content = this.renderPayStringToolTip()
    } else if (mode === 'nftId') {
      content = this.renderNFTId()
    }

    return content ? (
      <div
        tabIndex="0"
        role="button"
        className={className}
        style={style}
        onClick={() => this.setState({ mode: null })}
        onKeyUp={() => this.setState({ mode: null })}
      >
        {content}
      </div>
    ) : null
  }
}

Tooltip.propTypes = {
  t: PropTypes.func,
  language: PropTypes.string,
  data: PropTypes.shape({}),
}

Tooltip.defaultProps = {
  t: (d) => d,
  language: undefined,
  data: null,
}

export default Tooltip
