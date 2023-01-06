import React from 'react'
import { useTranslation } from 'react-i18next'
import '../../../../shared/css/nested-menu.scss'
import '../../../AccountHeader/styles.scss'
import '../../../AccountHeader/balance-selector.scss'
import { localizeNumber, localizeBalance } from '../../../../shared/utils'
import Currency from '../../../../shared/components/Currency'

export interface AmmDataType {
  balance: { currency: string; amount: number; issuer: string }
  balance2: { currency: string; amount: number; issuer: string }
  lpBalance: number
  tradingFee: number
  accountId: string
  language: string
}

export const AMMAccountHeader = (props: AmmDataType) => {
  const { balance, balance2, tradingFee, lpBalance, accountId, language } =
    props
  const { t } = useTranslation()
  const b1 = localizeBalance(balance, language)
  const b2 = localizeBalance(balance2, language)
  const tradingFeeTotal = 1000
  const lp = localizeNumber(lpBalance, language, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })
  const tf = localizeNumber(tradingFee / tradingFeeTotal, language, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 3,
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
            <div className="title">{t('trading_fee')}</div>
            <div className="value">%{tf}</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="box account-header">
      <div className="section box-header">
        <div className="amm-title">Account ID</div>
        <h2 className="amm">{accountId}</h2>
        <div className="currency-pair">
          <Currency {...balance} showIssuer={false} />/
          <Currency {...balance2} showIssuer={false} />
        </div>
      </div>
      <div className="box-content">{renderHeaderContent()}</div>
    </div>
  )
}
