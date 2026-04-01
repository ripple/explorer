import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { AggregatedStats } from './api'
import { parseCurrencyAmount } from '../shared/NumberFormattingUtils'
import InfoIcon from '../shared/images/general-info-icon.svg'
import HoverIcon from '../shared/images/hover.svg'
import { useTooltip } from '../shared/components/Tooltip'

interface GeneralInfoCardProps {
  stats: AggregatedStats | undefined
  currencyMode: 'usd' | 'xrp'
}

const DEFAULT_EMPTY_VALUE = '--'

export const GeneralInfoCard: FC<GeneralInfoCardProps> = ({
  stats,
  currencyMode,
}) => {
  const { t } = useTranslation()
  const { showTooltip, hideTooltip } = useTooltip()

  if (!stats) {
    return null
  }

  const tvl = currencyMode === 'usd' ? stats.tvl_usd : stats.tvl_xrp
  const volume24h =
    currencyMode === 'usd' ? stats.trading_volume_usd : stats.trading_volume_xrp

  // Format currency amounts with $ prefix for USD or XRP suffix for XRP
  // Uses K/M/B abbreviations for values >= 1000
  const formatCurrencyAmount = (value: number): string => {
    const suffix = currencyMode === 'xrp' ? ' XRP' : ''

    if (value >= 1000000000) {
      const formatted =
        currencyMode === 'usd'
          ? `$${(value / 1000000000).toFixed(2)}B`
          : `${(value / 1000000000).toFixed(2)}B${suffix}`
      return formatted
    }
    if (value >= 1000000) {
      const formatted =
        currencyMode === 'usd'
          ? `$${(value / 1000000).toFixed(2)}M`
          : `${(value / 1000000).toFixed(2)}M${suffix}`
      return formatted
    }
    if (value >= 1000) {
      const formatted =
        currencyMode === 'usd'
          ? `$${(value / 1000).toFixed(2)}K`
          : `${(value / 1000).toFixed(2)}K${suffix}`
      return formatted
    }

    // For values < 1000, use standard formatting
    const formatted = parseCurrencyAmount(value.toString())
    if (currencyMode === 'xrp') {
      return `${formatted.replace('$', '')} XRP`
    }
    return formatted
  }

  const renderTooltip = (key: string) => (
    <HoverIcon
      className="hover"
      onMouseOver={(e) => {
        const rect = e.currentTarget.getBoundingClientRect()
        showTooltip('text', e, t(`${key}_tooltip`), {
          x: rect.left + rect.width / 2,
          y: rect.top - 60,
        })
      }}
      onMouseLeave={() => hideTooltip()}
    />
  )

  return (
    <div className="general-info-card">
      <div className="card-header">
        <InfoIcon className="info-icon" />
        <span className="card-title">{t('general_info')}</span>
      </div>

      <div className="stats-container">
        <div className="stat-row">
          <div className="stat-label">{t('tvl')}</div>
          <div className="stat-value">
            {tvl ? formatCurrencyAmount(tvl) : DEFAULT_EMPTY_VALUE}
          </div>
        </div>

        <div className="stat-row">
          <div className="stat-label">
            {t('number_of_amms')}
            {renderTooltip('number_of_amms')}
          </div>
          <div className="stat-value">
            {stats.amm_pool_count
              ? stats.amm_pool_count.toLocaleString()
              : DEFAULT_EMPTY_VALUE}
          </div>
        </div>

        <div className="stat-row">
          <div className="stat-label">
            {t('number_of_lps')}
            {renderTooltip('number_of_lps')}
          </div>
          <div className="stat-value">
            {stats.liquidity_provider_count
              ? stats.liquidity_provider_count.toLocaleString()
              : DEFAULT_EMPTY_VALUE}
          </div>
        </div>

        <div className="stat-row">
          <div className="stat-label">{t('24h_volume')}</div>
          <div className="stat-value">
            {volume24h ? formatCurrencyAmount(volume24h) : DEFAULT_EMPTY_VALUE}
          </div>
        </div>
      </div>
    </div>
  )
}
