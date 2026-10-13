import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { useTooltip } from '../../shared/components/Tooltip'
import HoverIcon from '../../shared/images/hover.svg'
import MarketDataIcon from '../../shared/images/market_data_icon.svg'
import {
  parseCurrencyAmount,
  parsePercent,
  parseAmount,
  parseIntegerAmount,
} from '../../shared/NumberFormattingUtils'
import Currency from '../../shared/components/Currency'
import { LOSAMMPoolData, FormattedBalance } from '../types'

/** Renders "BALANCE (XRP)" or "BALANCE (CRYPTO)" with no extra whitespace */
const BalanceLabel = ({
  currency,
  issuer,
}: {
  currency: string
  issuer?: string
}) => {
  const { t } = useTranslation()
  return (
    <span className="info-card-label">
      {`${t('balance').toUpperCase()} (`}
      <Currency
        currency={currency}
        issuer={issuer}
        link={false}
        displaySymbol={false}
        hideIssuer
      />
      {/* eslint-disable-next-line react/jsx-curly-brace-presence */}
      {')'}
    </span>
  )
}

interface MarketDataCardProps {
  losData?: LOSAMMPoolData
  /**
   * When false, the TVL / volume / fees / APR rows still render but read '--': those values
   * can only be priced reliably for XRP-based pools. Keeping the rows preserves the
   * card's shape and makes the absence explicit rather than looking like a missing feature.
   * Defaults to true so existing callers and tests are unaffected.
   */
  isXrpBased?: boolean
  balance1: FormattedBalance | null
  balance2: FormattedBalance | null
  lpTokenBalance: string | undefined
}

export const MarketDataCard: FC<MarketDataCardProps> = ({
  losData,
  isXrpBased = true,
  balance1,
  balance2,
  lpTokenBalance,
}) => {
  const { t } = useTranslation()
  const { showTooltip, hideTooltip } = useTooltip()

  // APR is fees / TVL, so it inherits TVL's accuracy and is gated alongside it.
  // The on-ledger balances and the liquidity-provider count below are unaffected.
  const gatedValue = <T,>(
    value: T | null | undefined,
    format: (v: T) => string,
  ) => (isXrpBased && value != null ? format(value) : '--')

  const renderTooltipIcon = (text: string) => (
    <HoverIcon
      className="hover"
      onMouseOver={(e: React.MouseEvent<SVGSVGElement>) => {
        const rect = e.currentTarget.getBoundingClientRect()
        showTooltip('text', e, text, {
          x: rect.left + rect.width,
          y: rect.top - 85,
        })
      }}
      onMouseLeave={() => hideTooltip()}
    />
  )

  return (
    <div className="info-card">
      <h3 className="info-card-title">
        <MarketDataIcon className="info-card-icon" />
        {t('market_data')}
      </h3>
      <div className="info-card-rows">
        {losData && (
          <>
            <div className="info-card-row">
              <span className="info-card-label">{t('tvl')}</span>
              <span className="info-card-value">
                {gatedValue(losData.tvl_usd, parseCurrencyAmount)}
              </span>
            </div>
            <div className="info-card-row">
              <span className="info-card-label">
                {t('volume_24h')}
                {renderTooltipIcon(t('volume_24h_tooltip'))}
              </span>
              <span className="info-card-value">
                {gatedValue(losData.trading_volume_usd, parseCurrencyAmount)}
              </span>
            </div>
            <div className="info-card-row">
              <span className="info-card-label">
                {t('fees_24h')}
                {renderTooltipIcon(t('fees_24h_tooltip'))}
              </span>
              <span className="info-card-value">
                {gatedValue(losData.fees_collected_usd, parseCurrencyAmount)}
              </span>
            </div>
            <div className="info-card-row">
              <span className="info-card-label">
                {t('apr_24h')}
                {renderTooltipIcon(t('apr_24h_tooltip'))}
              </span>
              <span className="info-card-value">
                {gatedValue(losData.annual_percentage_return, (v) =>
                  parsePercent(v, 3, 0.001),
                )}
              </span>
            </div>
          </>
        )}
        {balance1 && (
          <div className="info-card-row">
            <BalanceLabel
              currency={balance1.currency}
              issuer={balance1.issuer}
            />
            <span className="info-card-value">
              {parseAmount(balance1.amount)}
            </span>
          </div>
        )}
        {balance2 && (
          <div className="info-card-row">
            <BalanceLabel
              currency={balance2.currency}
              issuer={balance2.issuer}
            />
            <span className="info-card-value">
              {parseAmount(balance2.amount)}
            </span>
          </div>
        )}
        {lpTokenBalance && (
          <div className="info-card-row">
            <span className="info-card-label">{t('lp_tokens')}</span>
            <span className="info-card-value">
              <div>{parseAmount(lpTokenBalance)}</div>
              {losData && (
                <div className="info-card-subtitle">
                  {parseIntegerAmount(losData.liquidity_provider_count)}{' '}
                  {t('liquidity_providers')}
                </div>
              )}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
