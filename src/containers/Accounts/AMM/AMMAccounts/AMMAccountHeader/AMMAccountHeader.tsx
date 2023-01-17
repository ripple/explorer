import { useTranslation } from 'react-i18next'
import '../../../../shared/css/nested-menu.scss'
import '../../../AccountHeader/styles.scss'
import '../../../AccountHeader/balance-selector.scss'
import {
  formatTradingFee,
  localizeBalance,
  localizeNumber,
} from '../../../../shared/utils'
import Currency from '../../../../shared/components/Currency'
import { ExplorerAmount } from '../../../../shared/types'

export interface AmmDataType {
  balance: ExplorerAmount
  balance2: ExplorerAmount
  lpBalance: number
  tradingFee: number
  accountId: string
  language: string
}

export const AMMAccountHeader = (props: { data: AmmDataType }) => {
  const { data } = props
  const { balance, balance2, tradingFee, lpBalance, accountId, language } = data
  const { t } = useTranslation()
  const localizedBalance1 = localizeBalance(balance, language)
  const localizedBalance2 = localizeBalance(balance2, language)
  const localizedLPBalance = localizeNumber(lpBalance, language, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })
  const localizedTradingFee = tradingFee
    ? formatTradingFee(tradingFee)
    : undefined

  function renderHeaderContent() {
    return (
      <div className="section header-container">
        <div className="info-container">
          <div className="values">
            <div className="title">{t('lp_token_balance')}</div>
            <div className="value">{localizedLPBalance}</div>
          </div>
          <div className="values">
            <div className="title">{t('token_balance')}</div>
            <div className="value">{localizedBalance1}</div>
          </div>
          <div className="values">
            <div className="title">{t('token_balance')}</div>
            <div className="value">{localizedBalance2}</div>
          </div>
          <div className="values">
            <div className="title">{t('trading_fee')}</div>
            <div className="value">%{localizedTradingFee}</div>
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
          <Currency
            currency={balance.currency}
            issuer={balance.issuer}
            shortenIssuer
          />
          /
          <Currency
            currency={balance2.currency}
            issuer={balance2.issuer}
            shortenIssuer
          />
        </div>
      </div>
      <div className="box-content">{renderHeaderContent()}</div>
    </div>
  )
}
