import { useTranslation } from 'react-i18next'
import { convertScaledPrice } from '../../../shared/utils'
import { parseAmount } from '../../../shared/NumberFormattingUtils'
import { Tooltip, useTooltip } from '../../../shared/components/Tooltip'
import HoverIcon from '../../../shared/images/hover.svg'

const TOOLTIP_Y_OFFSET = 60

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
  const { tooltip, showTooltip, hideTooltip } = useTooltip()

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

  const renderConfBalanceTooltip = () => (
    <HoverIcon
      className="hover"
      onMouseOver={(e) => {
        const rect = e.currentTarget.getBoundingClientRect()
        showTooltip('text', e, t('confidential_balance_tooltip'), {
          x: rect.left + rect.width / 2,
          y: rect.top - TOOLTIP_Y_OFFSET,
        })
      }}
      onMouseLeave={() => hideTooltip()}
    />
  )

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
              {renderConfBalanceTooltip()}
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
