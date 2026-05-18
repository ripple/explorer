import { useTranslation } from 'react-i18next'
import { convertScaledPrice } from '../../../shared/utils'
import { parseAmount } from '../../../shared/NumberFormattingUtils'
import { Tooltip, useTooltip } from '../../../shared/components/Tooltip'
import { ConfBalanceTooltipIcon } from '../../../shared/components/ConfBalanceTooltipIcon'

interface MarketDataProps {
  maxAmt?: string
  outstandingAmt?: string
  confidentialOutstandingAmt?: string
  assetScale?: number
}

export const MarketData = ({
  maxAmt,
  outstandingAmt,
  confidentialOutstandingAmt,
  assetScale,
}: MarketDataProps): JSX.Element => {
  const { t } = useTranslation()
  const { tooltip } = useTooltip()

  const formattedSupply = parseAmount(
    convertScaledPrice(BigInt(maxAmt || '0'), assetScale ?? 0),
  )

  const formattedCircSupply = parseAmount(
    convertScaledPrice(BigInt(outstandingAmt || '0'), assetScale ?? 0),
  )

  const formattedConfidentialAmt = confidentialOutstandingAmt
    ? parseAmount(
        convertScaledPrice(BigInt(confidentialOutstandingAmt), assetScale ?? 0),
      )
    : undefined

  return (
    <div className="header-box">
      <Tooltip tooltip={tooltip} />
      <div className="header-box-title">{t('token_page.market_data')}</div>
      <div className="header-box-contents">
        <div className="header-box-item">
          <div className="item-name">{t('token_page.supply')}</div>
          <div className="item-value">{formattedSupply}</div>
        </div>
        <div className="header-box-item">
          <div className="item-name">{t('token_page.circulating_supply')}</div>
          <div className="item-value">{formattedCircSupply}</div>
        </div>
        {formattedConfidentialAmt && (
          <div className="header-box-item">
            <div className="item-name">
              {t('token_page.confidential_balances')}{' '}
              <ConfBalanceTooltipIcon tooltipKey="confidential_balance_tooltip" />
            </div>
            <div className="item-value">{formattedConfidentialAmt}</div>
          </div>
        )}
        <div className="header-box-item">
          <div className="item-name">{t('token_page.market_cap')}</div>
          <div className="item-value">--</div>
        </div>
        <div className="header-box-item">
          <div className="item-name">{t('token_page.volume_24h')}</div>
          <div className="item-value">--</div>
        </div>
        <div className="header-box-item">
          <div className="item-name">{t('token_page.trades_24h')}</div>
          <div className="item-value">--</div>
        </div>
        <div className="header-box-item">
          <div className="item-name">{t('token_page.amm_tvl')}</div>
          <div className="item-value">--</div>
        </div>
      </div>
    </div>
  )
}
