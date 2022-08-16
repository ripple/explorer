import React from 'react'
import PropTypes from 'prop-types'
import { localizeNumber } from '../../shared/utils'
import { ReactComponent as IconDownArrow } from '../../shared/images/down_arrow.svg'
import iconClose from '../../shared/images/close.png'
import '../../shared/css/nested-menu.scss'
import './styles.scss'
import './balance-selector.scss'

const BalanceSelector = ({
  language,
  text,
  balances,
  onClick,
  expandMenu,
  onMouseLeave,
  onSetCurrencySelected,
  currencySelected,
}) => {
  const balanceMenuItems = Object.entries(balances).map(([currency, value]) => {
    if (currency === currencySelected) {
      return null
    }
    const formattedValue =
      localizeNumber(value, language, {
        style: 'currency',
        currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      }) || '0.00'
    return (
      <button
        className="menu-item"
        type="button"
        onClick={() => {
          onSetCurrencySelected(currency)
          onClick()
        }}
        onKeyDown={() => {
          onSetCurrencySelected(currency)
          onClick()
        }}
        key={currency}
      >
        <div className="menu-item-currency">{currency}</div>
        <div className="menu-item-value">{formattedValue}</div>
      </button>
    )
  })
  return (
    <div
      className={`balance-selector nested-menu ${
        expandMenu ? 'is-active' : ''
      }`}
      onMouseLeave={() => setTimeout(onMouseLeave, 2000)}
    >
      <button
        type="button"
        className="balance-selector-button"
        onClick={onClick}
      >
        <span className="selector-text">{text}</span>
        {expandMenu ? (
          <img
            className="icon selector-icon selector-icon-close"
            src={iconClose}
            alt=""
          />
        ) : (
          <IconDownArrow className="icon selector-icon" alt="" />
        )}
      </button>
      {expandMenu && <div className="nested-items">{balanceMenuItems}</div>}
    </div>
  )
}

BalanceSelector.propTypes = {
  language: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  expandMenu: PropTypes.bool.isRequired,
  balances: PropTypes.shape({}).isRequired,
  onClick: PropTypes.func.isRequired,
  onMouseLeave: PropTypes.func.isRequired,
  onSetCurrencySelected: PropTypes.func.isRequired,
  currencySelected: PropTypes.string.isRequired,
}

export default BalanceSelector
