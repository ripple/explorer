import React from 'react'
import { useTranslation } from 'react-i18next'
import 'containers/shared/css/nested-menu.scss'
import 'containers/Accounts/AccountHeader/styles.scss'
import 'containers/Accounts/AccountHeader/balance-selector.scss'
import { AmmDataType } from '../index'
import { localizeNumber } from '../../../../shared/utils'

const localizeBalance = (
  balance: { currency: string; amount: number },
  language: string,
) => {
  let b = localizeNumber(balance.amount || 0.0, language, {
    style: 'currency',
    currency: balance.currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })

  if (
    balance.currency !== 'XRP' &&
    balance.currency !== 'BTC' &&
    balance.currency !== 'ETH'
  ) {
    b = `${balance.currency} ${b}`
  }

  return b
}

const AMMAccountHeader = (props: AmmDataType) => {
  const {
    ammId,
    balance,
    balance2,
    tradingFee,
    lpBalance,
    accountId,
    language,
  } = props
  const { t } = useTranslation()

  const b1 = localizeBalance(balance, language)
  const b2 = localizeBalance(balance2, language)

  const lp = localizeNumber(lpBalance, language, {
    style: 'currency',
    currency: '',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })

  function renderHeaderContent() {
    return (
      <div className="section header-container">
        <div className="info-container">
          <div className="values">
            <div className="title">{t('amm_lp_token_balance')}</div>
            <div className="value">{lp}</div>
          </div>
          <div className="values">
            <div className="title">{t('amm_token_balance')}</div>
            <div className="value">{b1}</div>
          </div>
          <div className="values">
            <div className="title">{t('amm_token_balance')}</div>
            <div className="value">{b2}</div>
          </div>
          <div className="values">
            <div className="title">{t('amm_trading_fee')}</div>
            <div className="value">{tradingFee}</div>
          </div>
          <div className="values">
            <div className="title">{t('amm_account_address')}</div>
            <div className="value">{accountId}</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="box account-header">
      <div className="section box-header">
        <div className="amm-title">AMMID</div>
        <h2 className="amm">{ammId}</h2>
        <div className="currency-pair">
          {balance.currency}/{balance2.currency}
        </div>
      </div>
      <div className="box-content">{renderHeaderContent()}</div>
    </div>
  )
}

export default AMMAccountHeader
