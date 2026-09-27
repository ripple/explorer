import { useTranslation } from 'react-i18next'
import { convertScaledPrice } from '../../../shared/utils'
import { parseAmount } from '../../../shared/NumberFormattingUtils'
import { Tooltip, useTooltip } from '../../../shared/components/Tooltip'
import { ConfBalanceTooltipIcon } from '../../../shared/components/ConfBalanceTooltipIcon'

interface MarketDataProps {
  outstandingAmt?: string
  confidentialOutstandingAmt?: string
  assetScale?: number
  // Circulating supply (outstanding minus large holders), scaled decimal string.
  circulatingSupply?: string
  circulatingSupplyLoading?: boolean
}

export const MarketData = ({
  outstandingAmt,
  confidentialOutstandingAmt,
  assetScale,
  circulatingSupply,
  circulatingSupplyLoading,
}: MarketDataProps): JSX.Element => {
  const { t } = useTranslation()
  const { tooltip } = useTooltip()

  // Supply is the on-chain outstanding amount. A zero supply isn't a meaningful
  // figure, so show "--" rather than "0.00".
  const scaledOutstanding = convertScaledPrice(
    BigInt(outstandingAmt || '0'),
    assetScale ?? 0,
  )
  const formattedSupply = Number(scaledOutstanding)
    ? parseAmount(scaledOutstanding)
    : '--'

  // Circulating supply is derived from holder data, and is undefined when that
  // is unavailable (e.g. the holders request failed) — "--" either way, never
  // the unadjusted supply, which would look like a real circulating figure.
  const formattedCircSupply =
    circulatingSupply && Number(circulatingSupply)
      ? parseAmount(circulatingSupply)
      : '--'

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
          <div className="item-value">
            {circulatingSupplyLoading ? (
              <span className="loading-spinner" />
            ) : (
              formattedCircSupply
            )}
          </div>
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
