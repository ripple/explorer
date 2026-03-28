import { FC, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { TooltipProps } from 'recharts'
import {
  DualAxisAreaChart,
  AxisConfig,
} from '../shared/components/DualAxisAreaChart'
import { Loader } from '../shared/components/Loader'
import { useTooltip } from '../shared/components/Tooltip'
import { parseCurrencyAmount } from '../shared/NumberFormattingUtils'
import { fetchAMMHistoricalTrends } from './api'

interface TVLVolumeChartProps {
  ammAccountId: string
  displayCurrency: 'usd' | 'xrp'
  setDisplayCurrency: (currency: 'usd' | 'xrp') => void
}

const TIME_RANGES = ['1W', '1M', '6M', '1Y', '5Y'] as const
const TVL_COLOR = '#32E685'
const VOLUME_COLOR = '#7919FF'

/** Filter 5Y data to match the selected time range */
const filterDataByTimeRange = (data: any[], timeRange: string): any[] => {
  if (!data.length || timeRange === '5Y') return data
  const now = new Date()
  let cutoff: Date
  switch (timeRange) {
    case '1W':
      cutoff = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      break
    case '1M':
      cutoff = new Date(now)
      cutoff.setMonth(cutoff.getMonth() - 1)
      break
    case '6M':
      cutoff = new Date(now)
      cutoff.setMonth(cutoff.getMonth() - 6)
      break
    case '1Y':
      cutoff = new Date(now)
      cutoff.setFullYear(cutoff.getFullYear() - 1)
      break
    default:
      return data
  }
  return data.filter((point) => new Date(point.date) >= cutoff)
}

const formatDateTick = (value: string, timeRange: string): string => {
  const date = new Date(value)
  if (timeRange === '5Y') {
    return date.toLocaleDateString('en-US', { year: '2-digit' })
  }
  if (timeRange === '1W') {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }
  return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
}

const formatCurrencyTick = (
  value: number,
  currencyMode: 'usd' | 'xrp',
): string => {
  const prefix = currencyMode === 'usd' ? '$' : ''
  if (value === 0) return `${prefix}0`
  if (value >= 1000000) return `${prefix}${(value / 1000000).toFixed(1)}M`
  if (value >= 1000) return `${prefix}${(value / 1000).toFixed(0)}K`
  return `${prefix}${value.toFixed(0)}`
}

const CustomTooltip = ({
  active,
  payload,
  label,
}: TooltipProps<number | string, string>) => {
  if (active && payload && payload.length > 0) {
    const date = new Date(label as string)
    const formattedDate = date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
    return (
      <div className="chart-tooltip">
        <p className="tooltip-label">{formattedDate}</p>
        {payload.map((entry) => (
          <p
            key={`${entry.name}-${entry.dataKey}`}
            className="tooltip-value"
            style={{ color: entry.color }}
          >
            {entry.name}: {parseCurrencyAmount(String(entry.value ?? 0))}
          </p>
        ))}
      </div>
    )
  }
  return null
}

export const TVLVolumeChart: FC<TVLVolumeChartProps> = ({
  ammAccountId,
  displayCurrency,
  setDisplayCurrency,
}) => {
  const { t } = useTranslation()
  const { showTooltip, hideTooltip } = useTooltip()
  const [timeRange, setTimeRange] = useState<string>('6M')
  const [showTVL, setShowTVL] = useState(true)
  const [showVolume, setShowVolume] = useState(true)

  // Fetch 5Y data once and filter client-side for other ranges
  const { data: trendsData, isLoading } = useQuery(
    ['ammHistoricalTrends', ammAccountId],
    () => fetchAMMHistoricalTrends(ammAccountId, '5Y'),
    { enabled: !!ammAccountId },
  )

  const filteredData = useMemo(
    () => filterDataByTimeRange(trendsData?.data_points || [], timeRange),
    [trendsData, timeRange],
  )

  const chartData = filteredData.map((point: any) => ({
    date: point.date,
    tvl: displayCurrency === 'usd' ? point.tvl_usd : point.tvl_xrp,
    volume:
      displayCurrency === 'usd'
        ? point.trading_volume_usd
        : point.trading_volume_xrp,
  }))

  const leftAxis: AxisConfig = {
    dataKey: 'tvl',
    label: 'TVL',
    color: TVL_COLOR,
    formatter: (value: number) => formatCurrencyTick(value, displayCurrency),
    show: showTVL,
  }

  const rightAxis: AxisConfig = {
    dataKey: 'volume',
    label: 'Volume',
    color: VOLUME_COLOR,
    formatter: (value: number) => formatCurrencyTick(value, displayCurrency),
    show: showVolume,
  }

  return (
    <div className="tvl-volume-section">
      <h2 className="chart-section-title">{t('tvl_and_volume')}</h2>

      {/* Controls row: toggle + checkboxes (matching AMM Rankings page) */}
      <div className="controls">
        <div className="currency-toggle-wrapper">
          <span
            className={`currency-label ${displayCurrency === 'usd' ? 'active' : ''}`}
          >
            USD
          </span>
          {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
          <label className="toggle-switch" aria-label="Toggle currency">
            <input
              type="checkbox"
              checked={displayCurrency === 'xrp'}
              onChange={() =>
                setDisplayCurrency(displayCurrency === 'usd' ? 'xrp' : 'usd')
              }
            />
            <span className="toggle-slider" />
          </label>
          <span
            className={`currency-label ${displayCurrency === 'xrp' ? 'active' : ''}`}
          >
            XRP
          </span>
        </div>

        <label className="filter-checkbox" htmlFor="tvl-checkbox">
          <input
            id="tvl-checkbox"
            type="checkbox"
            checked={showTVL}
            onChange={() => setShowTVL(!showTVL)}
          />
          <span className="checkbox-custom" />
          <span>{t('tvl')}</span>
        </label>
        <label className="filter-checkbox" htmlFor="volume-checkbox">
          <input
            id="volume-checkbox"
            type="checkbox"
            checked={showVolume}
            onChange={() => setShowVolume(!showVolume)}
          />
          <span className="checkbox-custom" />
          <span>{t('volume')}</span>
        </label>
      </div>

      {/* Chart container (matching AMM Rankings page structure) */}
      <div className="tvl-volume-chart-container">
        <div className="chart-header">
          <div className="time-filters">
            {TIME_RANGES.map((range) => (
              <button
                key={range}
                className={`time-filter ${timeRange === range ? 'active' : ''}`}
                onClick={() => setTimeRange(range)}
                type="button"
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <Loader />
        ) : (
          <DualAxisAreaChart
            data={chartData}
            xAxisKey="date"
            xAxisFormatter={(value) => formatDateTick(value, timeRange)}
            leftAxis={leftAxis}
            rightAxis={rightAxis}
            tooltipContent={CustomTooltip}
          />
        )}

        <div className="chart-legend">
          <div
            className="legend-item"
            onMouseOver={(e) => {
              const rect = e.currentTarget.getBoundingClientRect()
              showTooltip('text', e, t('tvl_tooltip' as any), {
                x: rect.left + rect.width / 2,
                y: rect.top - 60,
              })
            }}
            onFocus={() => {}}
            onMouseLeave={() => hideTooltip()}
          >
            <span className="legend-color tvl-color" />
            <span className="legend-text">{t('tvl')}</span>
          </div>
          <div className="legend-item">
            <span className="legend-color volume-color" />
            <span className="legend-text">{t('volume')}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
