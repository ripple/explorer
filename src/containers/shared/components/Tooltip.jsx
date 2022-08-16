import React, { Component } from 'react'
import PropTypes from 'prop-types'
import successIcon from '../images/success.png'
import infoIcon from '../images/info_orange.png'
import { localizeDate } from '../utils'
import '../css/tooltip.scss'
import { ReactComponent as PayStringToolTip } from '../images/paystring_tooltip.svg'

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
    const { v = {}, pubkey, time } = this.state
    const key = v.master_key || pubkey

    return (
      <>
        <div className="domain">{v.domain}</div>
        <div className="pubkey">{key}</div>
        <div className="time">{localizeDate(time, language, DATE_OPTIONS)}</div>
        {v.unl && (
          <div className="unl">
            {v.unl}
            <img src={successIcon} alt={v.unl} />
          </div>
        )}
      </>
    )
  }

  renderTxTooltip() {
    const { type, result, account } = this.state
    const success = result === 'tesSUCCESS'
    return (
      <>
        <div className={`tx-type ${type}`}>
          {type}
          <img src={success ? successIcon : infoIcon} alt={result} />
          <span className={`result ${result}`}>{success ? '' : result}</span>
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

  static renderPayStringToolTip() {
    return <PayStringToolTip className="paystring" alt="" />
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
      style.top = y - 180
      style.left = x - 135
      style.background = 'rgba(0,0,0,0)'
      className += ' paystring'
      content = Tooltip.renderPayStringToolTip()
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
