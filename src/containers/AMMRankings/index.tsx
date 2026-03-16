import { FC, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { Loader } from '../shared/components/Loader'
import { Tooltip, useTooltip } from '../shared/components/Tooltip'
import { useAnalytics } from '../shared/analytics'
import Log from '../shared/log'
import { AMMRankingsTable } from './AMMRankingsTable'
import { GeneralInfoCard } from './GeneralInfoCard'
import { TVLVolumeChart } from './TVLVolumeChart'
import { fetchAMMRankings, fetchAggregatedStats, fetchHistoricalTrends } from './api'
import './ammRankings.scss'

type CurrencyMode = 'usd' | 'xrp'
type TimeRange = '1D' | '1M' | '6M' | '1Y' | '5Y'

export const AMMRankings: FC = () => {
  const { t } = useTranslation()
  const { trackScreenLoaded, trackException } = useAnalytics()
  const { tooltip } = useTooltip()

  const [currencyMode, setCurrencyMode] = useState<CurrencyMode>('usd')
  const [showTVL, setShowTVL] = useState(true)
  const [showVolume, setShowVolume] = useState(true)
  const [timeRange, setTimeRange] = useState<TimeRange>('6M')
  const [sortField, setSortField] = useState('tvl_usd')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  useEffect(() => {
    trackScreenLoaded()
  }, [trackScreenLoaded])

  const { data: ammRankingsData, isLoading: isLoadingRankings } = useQuery(
    ['ammRankings', sortField, sortOrder],
    () => fetchAMMRankings(sortField, sortOrder),
    {
      refetchInterval: 60 * 1000,
      onError: (error) => {
        Log.error(error)
        trackException(`AMM rankings fetch --- ${JSON.stringify(error)}`)
      },
    },
  )

  const { data: aggregatedStats, isLoading: isLoadingStats } = useQuery(
    ['ammAggregatedStats'],
    () => fetchAggregatedStats(),
    {
      refetchInterval: 60 * 1000,
      onError: (error) => {
        Log.error(error)
        trackException(`AMM aggregated stats fetch --- ${JSON.stringify(error)}`)
      },
    },
  )

  const { data: historicalData, isLoading: isLoadingHistory } = useQuery(
    ['ammHistoricalTrends', timeRange],
    () => fetchHistoricalTrends(timeRange),
    {
      refetchInterval: 60 * 1000,
      onError: (error) => {
        Log.error(error)
        trackException(`AMM historical trends fetch --- ${JSON.stringify(error)}`)
      },
    },
  )

  const isLoading = isLoadingRankings || isLoadingStats || isLoadingHistory

  return (
    <div className="amm-rankings-page">
      <Tooltip tooltip={tooltip} />

      <div className="page-header">
        <h1 className="page-title">{t('amms')}</h1>
      </div>

      <div className="controls">
        <div className="currency-toggle-wrapper">
          <span
            className={
              currencyMode === 'usd' ? 'currency-label active' : 'currency-label'
            }
          >
            USD
          </span>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={currencyMode === 'xrp'}
              onChange={() =>
                setCurrencyMode(currencyMode === 'usd' ? 'xrp' : 'usd')
              }
            />
            <span className="toggle-slider" />
          </label>
          <span
            className={
              currencyMode === 'xrp' ? 'currency-label active' : 'currency-label'
            }
          >
            XRP
          </span>
        </div>

        <label className="filter-checkbox">
          <input
            type="checkbox"
            checked={showTVL}
            onChange={(e) => setShowTVL(e.target.checked)}
          />
          <span className="checkbox-custom" />
          <span>{t('tvl')}</span>
        </label>
        <label className="filter-checkbox">
          <input
            type="checkbox"
            checked={showVolume}
            onChange={(e) => setShowVolume(e.target.checked)}
          />
          <span className="checkbox-custom" />
          <span>{t('volume')}</span>
        </label>
      </div>

      {isLoading ? (
        <Loader />
      ) : (
        <>
          <div className="chart-and-info-container">
            <TVLVolumeChart
              data={historicalData?.data_points || []}
              timeRange={timeRange}
              setTimeRange={setTimeRange}
              showTVL={showTVL}
              showVolume={showVolume}
              currencyMode={currencyMode}
            />

            <GeneralInfoCard stats={aggregatedStats} currencyMode={currencyMode} />
          </div>

          <AMMRankingsTable
            amms={ammRankingsData?.results || []}
            sortField={sortField}
            setSortField={setSortField}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
            currencyMode={currencyMode}
          />
        </>
      )}
    </div>
  )
}
