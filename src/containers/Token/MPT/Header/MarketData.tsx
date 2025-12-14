import { useTranslation } from 'react-i18next'
import { convertScaledPrice } from '../../../shared/utils'
import { parseAmount } from '../../../shared/NumberFormattingUtils'

interface MarketDataProps {
  maxAmt?: string
  outstandingAmt?: string
  assetScale?: number
}

export const MarketData = ({
  maxAmt,
  outstandingAmt,
  assetScale,
}: MarketDataProps): JSX.Element => {
  const { t } = useTranslation()

  const formattedSupply = parseAmount(
    convertScaledPrice(BigInt(maxAmt || '0'), assetScale ?? 0),
  )

  const formattedCircSupply = parseAmount(
    convertScaledPrice(BigInt(outstandingAmt || '0'), assetScale ?? 0),
  )

  return (
    <div className="header-box">
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
