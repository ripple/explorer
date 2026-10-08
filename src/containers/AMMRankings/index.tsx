import { FC, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { Loader } from '../shared/components/Loader'
import { Tooltip, useTooltip } from '../shared/components/Tooltip'
import { TVLVolumeChart } from '../shared/components/TVLVolumeChart'
import { useAnalytics } from '../shared/analytics'
import { useOnQueryError } from '../shared/hooks'
import Log from '../shared/log'
import { AMMRankingsTable } from './AMMRankingsTable'
import { GeneralInfoCard } from './GeneralInfoCard'
import {
  fetchAMMRankings,
  fetchAggregatedStats,
  fetchHistoricalTrends,
} from './api'
import './ammRankings.scss'

type CurrencyMode = 'usd' | 'xrp'
type TimeRange = '1W' | '1M' | '6M' | '1Y' | '5Y'

const REFETCH_INTERVAL = 60 * 1000 // 1 minute

export const AMMRankings: FC = () => {
  const { t } = useTranslation()
  const { trackScreenLoaded, trackException } = useAnalytics()
  const { tooltip } = useTooltip()

  const [currencyMode, setCurrencyMode] = useState<CurrencyMode>('usd')
  const [timeRange, setTimeRange] = useState<TimeRange>('6M')
  const [sortField] = useState('tvl_usd')
  const [sortOrder] = useState<'asc' | 'desc'>('desc')

  useEffect(() => {
    trackScreenLoaded()
  }, [trackScreenLoaded])

  const {
    data: ammRankingsData,
    error: rankingsError,
    isLoading: isLoadingRankings,
  } = useQuery({
    queryKey: ['ammRankings', sortField, sortOrder],
    queryFn: () => fetchAMMRankings(sortField, sortOrder),
    refetchInterval: REFETCH_INTERVAL,
  })

  useOnQueryError(rankingsError, (error) => {
    Log.error(error)
    trackException(`AMM rankings fetch --- ${JSON.stringify(error)}`)
  })

  const {
    data: aggregatedStats,
    error: statsError,
    isLoading: isLoadingStats,
  } = useQuery({
    queryKey: ['ammAggregatedStats'],
    queryFn: () => fetchAggregatedStats(),
    refetchInterval: REFETCH_INTERVAL,
  })

  useOnQueryError(statsError, (error) => {
    Log.error(error)
    trackException(`AMM aggregated stats fetch --- ${JSON.stringify(error)}`)
  })

  const {
    data: historicalData,
    error: historyError,
    isLoading: isLoadingHistory,
  } = useQuery({
    queryKey: ['ammHistoricalTrends', timeRange],
    queryFn: () => fetchHistoricalTrends(timeRange),
    refetchInterval: REFETCH_INTERVAL,
    placeholderData: keepPreviousData,
  })

  useOnQueryError(historyError, (error) => {
    Log.error(error)
    trackException(`AMM historical trends fetch --- ${JSON.stringify(error)}`)
  })

  // Only show full-page loader on initial load.
  // Subsequent refetches (e.g. time range changes) should not unmount the chart,
  // otherwise its internal state (selected time range) resets.
  const isInitialLoading =
    (isLoadingRankings && !ammRankingsData) ||
    (isLoadingStats && !aggregatedStats) ||
    (isLoadingHistory && !historicalData)

  return (
    <div className="amm-rankings-page">
      <Tooltip tooltip={tooltip} />

      <div className="page-header">
        <h1 className="page-title">{t('amms')}</h1>
      </div>

      {isInitialLoading ? (
        <Loader />
      ) : (
        <>
          <div className="chart-and-info-container">
            <TVLVolumeChart
              data={(historicalData?.data_points || []).map((point) => ({
                date: point.date,
                tvl: currencyMode === 'usd' ? point.tvl_usd : point.tvl_xrp,
                volume:
                  currencyMode === 'usd'
                    ? point.trading_volume_usd
                    : point.trading_volume_xrp,
              }))}
              isLoading={isLoadingHistory}
              displayCurrency={currencyMode}
              setDisplayCurrency={setCurrencyMode}
              onTimeRangeChange={(range) => setTimeRange(range as TimeRange)}
            />

            <GeneralInfoCard
              stats={aggregatedStats}
              currencyMode={currencyMode}
            />
          </div>

          <AMMRankingsTable
            amms={ammRankingsData?.results || []}
            currencyMode={currencyMode}
          />
        </>
      )}
    </div>
  )
}
