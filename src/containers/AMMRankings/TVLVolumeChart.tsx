import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { TooltipProps } from 'recharts'
import { HistoricalDataPoint } from './api'
import { parseCurrencyAmount } from '../shared/NumberFormattingUtils'
import { useTooltip } from '../shared/components/Tooltip'
import {
  DualAxisAreaChart,
  AxisConfig,
} from '../shared/components/DualAxisAreaChart'

interface TVLVolumeChartProps {
  data: HistoricalDataPoint[]
  timeRange: string
  setTimeRange: (range: string) => void
  showTVL: boolean
  showVolume: boolean
  currencyMode: 'usd' | 'xrp'
}

type ValueType = number | string | Array<number | string>
type NameType = number | string

const TIME_RANGES = ['1W', '1M', '6M', '1Y', '5Y']

// TVL = green, Volume = purple (matching spec)
const TVL_COLOR = '#32E685'
const VOLUME_COLOR = '#7919FF'

const formatDateTick = (value: string, timeRange: string): string => {
  const date = new Date(value)
  if (timeRange === '5Y') {
    return date.toLocaleDateString('en-US', { year: '2-digit' })
  }
  return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
}

const formatTVLTick = (value: number, currencyMode: 'usd' | 'xrp'): string => {
  const prefix = currencyMode === 'usd' ? '$' : ''

  if (value === 0) return `${prefix}0`
  if (value >= 1000000) return `${prefix}${(value / 1000000).toFixed(1)}M`
  if (value >= 1000) return `${prefix}${(value / 1000).toFixed(0)}K`
  return `${prefix}${value.toFixed(0)}`
}

const formatVolumeTick = (
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
}: TooltipProps<ValueType, NameType>) => {
  if (active && payload && payload.length > 0) {
    const date = new Date(label)
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
            key={entry.name}
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
  data,
  timeRange,
  setTimeRange,
  showTVL,
  showVolume,
  currencyMode,
}) => {
  const { t } = useTranslation()
  const { showTooltip, hideTooltip } = useTooltip()

  const chartData = data.map((point) => ({
    date: point.date,
    tvl: currencyMode === 'usd' ? point.tvl_usd : point.tvl_xrp,
    volume:
      currencyMode === 'usd'
        ? point.trading_volume_usd
        : point.trading_volume_xrp,
  }))

  const leftAxis: AxisConfig = {
    dataKey: 'tvl',
    label: 'TVL',
    color: TVL_COLOR,
    formatter: (value: number) => formatTVLTick(value, currencyMode),
    show: showTVL,
  }

  const rightAxis: AxisConfig = {
    dataKey: 'volume',
    label: 'Volume',
    color: VOLUME_COLOR,
    formatter: (value: number) => formatVolumeTick(value, currencyMode),
    show: showVolume,
  }

  return (
    <div className="tvl-volume-chart-container">
      <div className="chart-header">
        <h2 className="chart-title">{t('tvl_and_volume')}</h2>
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

      <DualAxisAreaChart
        data={chartData}
        xAxisKey="date"
        xAxisFormatter={(value) => formatDateTick(value, timeRange)}
        leftAxis={leftAxis}
        rightAxis={rightAxis}
        tooltipContent={CustomTooltip}
      />

      <div className="chart-legend">
        <div
          className="legend-item"
          onMouseOver={(e) => {
            const rect = e.currentTarget.getBoundingClientRect()
            showTooltip('text', e, t('tvl_tooltip'), {
              x: rect.left + rect.width / 2,
              y: rect.top - 60,
            })
          }}
          onFocus={(e) => {
            const rect = e.currentTarget.getBoundingClientRect()
            showTooltip('text', e, t('tvl_tooltip'), {
              x: rect.left + rect.width / 2,
              y: rect.top - 60,
            })
          }}
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
  )
}
