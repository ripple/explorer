import { FC, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { useWindowSize } from 'usehooks-ts'
import { TooltipProps } from 'recharts'
import {
  DualAxisAreaChart,
  AxisConfig,
} from '../../shared/components/DualAxisAreaChart'
import { Loader } from '../../shared/components/Loader'
import { useTooltip } from '../../shared/components/Tooltip'
import { parseAmount } from '../../shared/NumberFormattingUtils'
import { CurrencySwitch } from '../../shared/components/CurrencySwitch'
import { fetchAMMHistoricalTrends } from '../api'
import './styles.scss'

interface TVLVolumeChartProps {
  ammAccountId: string
  displayCurrency: 'usd' | 'xrp'
  setDisplayCurrency: (currency: 'usd' | 'xrp') => void
}

const TIME_RANGES = ['1W', '1M', '6M', '1Y', '5Y'] as const
const TVL_COLOR = '#32E685'
const VOLUME_COLOR = '#7919FF'

const formatDateTick = (value: string, timeRange: string): string => {
  const date = new Date(value)
  if (timeRange === '5Y') {
    return date.toLocaleDateString('en-US', {
      year: '2-digit',
      timeZone: 'UTC',
    })
  }
  if (timeRange === '1W' || timeRange === '1M') {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      timeZone: 'UTC',
    })
  }
  return date.toLocaleDateString('en-US', {
    month: 'short',
    year: '2-digit',
    timeZone: 'UTC',
  })
}

const formatCurrencyTick = (
  value: number,
  currencyMode: 'usd' | 'xrp',
): string => {
  const prefix = currencyMode === 'usd' ? '$' : ''
  if (value === 0) {
    return `${prefix}0`
  }
  if (value >= 1000000) {
    return `${prefix}${(value / 1000000).toFixed(1)}M`
  }
  if (value >= 1000) {
    return `${prefix}${(value / 1000).toFixed(0)}K`
  }
  return `${prefix}${value.toFixed(0)}`
}

export const TVLVolumeChart: FC<TVLVolumeChartProps> = ({
  ammAccountId,
  displayCurrency,
  setDisplayCurrency,
}) => {
  const { t } = useTranslation()
  const { showTooltip, hideTooltip } = useTooltip()
  const { width: windowWidth = 1200 } = useWindowSize()
  const [timeRange, setTimeRange] = useState<string>('6M')
  const [showTVL, setShowTVL] = useState(true)
  const [showVolume, setShowVolume] = useState(true)

  const isSmallScreen = windowWidth < 600
  const chartMargin = isSmallScreen
    ? { top: 10, right: 10, left: 10, bottom: 0 }
    : { top: 10, right: 50, left: 50, bottom: 0 }
  const chartTickFontSize = isSmallScreen ? 10 : 13

  const formatTooltipValue = (value: number | string) => {
    const num = Number(value)
    const formatted = parseAmount(num)
    return displayCurrency === 'usd' ? `$${formatted}` : `${formatted} XRP`
  }

  const renderTooltip = ({
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
        timeZone: 'UTC',
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
              {entry.name}: {formatTooltipValue(entry.value ?? 0)}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  // Fetch data per time range from the API (each range may include different latest data)
  const { data: trendsData, isLoading } = useQuery(
    ['ammHistoricalTrends', ammAccountId, timeRange],
    () => fetchAMMHistoricalTrends(ammAccountId, timeRange),
    { enabled: !!ammAccountId, staleTime: 5 * 60 * 1000 },
  )

  const chartData = (trendsData?.data_points || []).map((point: any) => ({
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

      {/* Controls row: toggle + checkboxes */}
      <div className="controls">
        <CurrencySwitch
          leftLabel="USD"
          rightLabel="XRP"
          selected={displayCurrency === 'usd' ? 'USD' : 'XRP'}
          onChange={(value) =>
            setDisplayCurrency(value === 'USD' ? 'usd' : 'xrp')
          }
        />

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
            tooltipContent={renderTooltip}
            margin={chartMargin}
            tickFontSize={chartTickFontSize}
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
