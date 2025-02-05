import { useTranslation } from 'react-i18next'
import '../../../AccountHeader/styles.scss'
import { Amount } from '../../../../shared/components/Amount'
import { formatTradingFee, localizeNumber } from '../../../../shared/utils'
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
  const localizedLPBalance = localizeNumber(lpBalance, language, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })
  const localizedTradingFee = formatTradingFee(tradingFee)

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
            <div className="value">
              <Amount value={balance} displayIssuer={false} />
            </div>
          </div>
          <div className="values">
            <div className="title">{t('token_balance')}</div>
            <div className="value">
              <Amount value={balance2} displayIssuer={false} />
            </div>
          </div>
          <div className="values">
            <div className="title">{t('trading_fee')}</div>
            <div className="value">{localizedTradingFee}%</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="box account-header" data-testid="amm-header">
      <div className="section box-header">
        <div className="title">
          Account ID
          <div className="currency-pair" data-testid="currency-pair">
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
        <h1 className="classic">{accountId}</h1>
      </div>
      <div className="box-content">{renderHeaderContent()}</div>
    </div>
  )
}
