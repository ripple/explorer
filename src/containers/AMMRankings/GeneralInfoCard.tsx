import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { AggregatedStats } from './api'
import {
  parseAmount,
  parseCurrencyAmount,
} from '../shared/NumberFormattingUtils'
import InfoIcon from '../shared/images/info_book_icon.svg'
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

  const formatCurrencyAmount = (value: number): string => {
    if (currencyMode === 'xrp') {
      return `${parseAmount(value)} XRP`
    }
    return parseCurrencyAmount(value)
  }

  const renderTooltip = (key: string) => (
    <HoverIcon
      className="hover"
      onMouseOver={(e) => {
        const rect = e.currentTarget.getBoundingClientRect()
        showTooltip('text', e, t(`${key}_tooltip` as any), {
          x: rect.left + rect.width / 2,
          y: rect.top - 60,
        })
      }}
      onMouseLeave={() => hideTooltip()}
    />
  )

  return (
    <div className="info-card">
      <h3 className="info-card-title">
        <InfoIcon className="info-card-icon" />
        {t('general_info')}
      </h3>
      <div className="info-card-rows">
        <div className="info-card-row">
          <span className="info-card-label">
            {t('tvl')}
            {renderTooltip('tvl')}
          </span>
          <span className="info-card-value">
            {tvl ? formatCurrencyAmount(tvl) : DEFAULT_EMPTY_VALUE}
          </span>
        </div>
        <div className="info-card-row">
          <span className="info-card-label">
            {t('number_of_amms')}
            {renderTooltip('number_of_amms')}
          </span>
          <span className="info-card-value">
            {stats.amm_pool_count
              ? stats.amm_pool_count.toLocaleString()
              : DEFAULT_EMPTY_VALUE}
          </span>
        </div>
        <div className="info-card-row">
          <span className="info-card-label">
            {t('number_of_lps')}
            {renderTooltip('number_of_lps')}
          </span>
          <span className="info-card-value">
            {stats.liquidity_provider_count
              ? stats.liquidity_provider_count.toLocaleString()
              : DEFAULT_EMPTY_VALUE}
          </span>
        </div>
        <div className="info-card-row">
          <span className="info-card-label">
            {t('volume_24h' as any)}
            {renderTooltip('volume_24h_all')}
          </span>
          <span className="info-card-value">
            {volume24h ? formatCurrencyAmount(volume24h) : DEFAULT_EMPTY_VALUE}
          </span>
        </div>
      </div>
    </div>
  )
}
