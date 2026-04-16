import { FC, PropsWithChildren, useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router'
import { Helmet } from 'react-helmet-async'
import { useQuery } from 'react-query'
import NoMatch from '../NoMatch'
import { Loader } from '../shared/components/Loader'
import SocketContext from '../shared/SocketContext'
import { useAnalytics } from '../shared/analytics'
import { getAMMInfoByAMMAccount } from '../../rippled/lib/rippled'
import { NOT_FOUND, BAD_REQUEST } from '../shared/utils'
import { ErrorMessage } from '../shared/Interfaces'
import { formatAmount } from '../../rippled/lib/txSummary/formatAmount'
import { Tooltip, useTooltip } from '../shared/components/Tooltip'
import { AMMPoolHeader } from './AMMPoolHeader'
import { BasicInfoCard } from './InfoCards/BasicInfoCard'
import { MarketDataCard } from './InfoCards/MarketDataCard'
import { AuctionCard } from './InfoCards/AuctionCard'
import { AMMPoolTablePicker } from './TablePicker'
import { TVLVolumeChart } from '../shared/components/TVLVolumeChart'
import {
  fetchAMMPoolData,
  fetchAMMCreatedTimestamp,
  fetchAMMHistoricalTrends,
} from './api'
import { getDeletedAMMData, DeletedAMMData } from './utils'
import { AuctionSlot, FormattedBalance, HistoricalDataPoint } from './types'
import InfoIcon from '../shared/images/info-duotone.svg'
import './styles.scss'

const ERROR_MESSAGES: { [code: number]: ErrorMessage } = {
  [NOT_FOUND]: {
    title: 'amm_not_found',
    hints: ['check_amm_id'],
  },
  [BAD_REQUEST]: {
    title: 'invalid_amm_id',
    hints: ['check_amm_id'],
  },
}

const DEFAULT_ERROR: ErrorMessage = {
  title: 'get_amm_failed',
  hints: ['not_your_fault'],
}

const getErrorMessage = (error: number | null) =>
  error ? (ERROR_MESSAGES[error] ?? DEFAULT_ERROR) : DEFAULT_ERROR

const Page: FC<PropsWithChildren<{ ammAccountId: string }>> = ({
  ammAccountId,
  children,
}) => (
  <div className="amm-pool-page section">
    <Helmet title={`AMM Pool ${ammAccountId.substring(0, 12)}...`} />
    {children}
  </div>
)

/** Order assets: non-XRP first, XRP second (for header display) */
const orderAssets = (
  b1: FormattedBalance | null,
  b2: FormattedBalance | null,
): [FormattedBalance | null, FormattedBalance | null] => {
  if (b1 && b2 && b1.currency === 'XRP') {
    return [b2, b1]
  }
  return [b1, b2]
}

/**
 * Build FormattedBalance objects from deleted AMM data.
 * Deleted pools have no live balances, so amount is 0.
 */
const buildDeletedBalances = (
  data: DeletedAMMData,
): [FormattedBalance, FormattedBalance] => [
  {
    currency: data.asset.currency,
    issuer: data.asset.issuer,
    amount: 0,
  },
  {
    currency: data.asset2.currency,
    issuer: data.asset2.issuer,
    amount: 0,
  },
]

export const AMMPool = () => {
  const { t } = useTranslation()
  const { trackScreenLoaded, trackException } = useAnalytics()
  const { id: ammAccountId = '', tab = 'transactions' } = useParams<{
    id: string
    tab: string
  }>()
  const [error, setError] = useState<number | null>(null)
  const [displayCurrency, setDisplayCurrency] = useState<'usd' | 'xrp'>('usd')
  const rippledSocket = useContext(SocketContext)
  const isMainnet = process.env.VITE_ENVIRONMENT === 'mainnet'
  const { tooltip } = useTooltip()

  // Fetch on-ledger AMM data from Clio (balances, auction slot, trading fee)
  const { data: ammInfo, isFetching: ammInfoLoading } = useQuery(
    ['ammInfo', ammAccountId],
    async () => getAMMInfoByAMMAccount(rippledSocket, ammAccountId),
    {
      enabled: !!ammAccountId,
      retry: false,
      onError: (e: any) => {
        trackException(
          `Error fetching AMM info for ${ammAccountId} --- ${JSON.stringify(e)}`,
        )
        // Don't set error yet — we'll try deleted detection
      },
    },
  )

  // If amm_info failed, try to detect a deleted AMM pool
  const ammInfoFailed = !ammInfoLoading && !ammInfo && !!ammAccountId
  const { data: deletedData, isFetching: deletedLoading } = useQuery(
    ['ammDeleted', ammAccountId],
    () => getDeletedAMMData(rippledSocket, ammAccountId),
    {
      enabled: ammInfoFailed,
      onError: () => {
        // Both amm_info and deletion detection failed
        setError(NOT_FOUND)
      },
    },
  )

  // If amm_info failed, deletion check finished, and it's not a deleted pool → show error
  useEffect(() => {
    if (ammInfoFailed && !deletedLoading && !deletedData) {
      setError(NOT_FOUND)
    }
  }, [ammInfoFailed, deletedLoading, deletedData])

  const isDeleted = !!deletedData
  const isLoading = ammInfoLoading || (ammInfoFailed && deletedLoading)

  // Fetch LOS market data (mainnet only)
  const { data: losData } = useQuery(
    ['ammLosData', ammAccountId],
    () => fetchAMMPoolData(ammAccountId),
    {
      enabled: !!ammAccountId && isMainnet,
      onError: (e: any) => {
        trackException(
          `Error fetching AMM LOS data for ${ammAccountId} --- ${JSON.stringify(e)}`,
        )
      },
    },
  )

  // Fetch first transaction to get Created On timestamp
  const { data: createdTimestamp } = useQuery(
    ['ammCreatedOn', ammAccountId],
    () => fetchAMMCreatedTimestamp(rippledSocket, ammAccountId),
    { enabled: !!ammAccountId },
  )

  // Fetch data per time range from the API (each range may include different latest data)
  const [chartTimeRange, setChartTimeRange] = useState('6M')
  const { data: trendsData, isLoading: trendsLoading } = useQuery(
    ['ammHistoricalTrends', ammAccountId, chartTimeRange],
    () => fetchAMMHistoricalTrends(ammAccountId, chartTimeRange),
    { enabled: !!ammAccountId, staleTime: 5 * 60 * 1000 },
  )

  useEffect(() => {
    trackScreenLoaded({ account_id: ammAccountId })
    return () => {
      window.scrollTo(0, 0)
    }
  }, [ammAccountId, trackScreenLoaded])

  if (error) {
    const message = getErrorMessage(error)
    return (
      <Page ammAccountId={ammAccountId}>
        <NoMatch title={message.title} hints={message.hints} />
      </Page>
    )
  }

  // Build unified data from either live amm_info or deleted pool metadata
  const ammData = ammInfo?.amm
  let balance1: FormattedBalance | null = null
  let balance2: FormattedBalance | null = null
  let tradingFee = 0
  let lpToken: { currency: string; issuer: string; value: string } | undefined
  let auctionSlot: AuctionSlot | undefined

  if (ammData) {
    balance1 = formatAmount(ammData.amount)
    balance2 = formatAmount(ammData.amount2)
    tradingFee = ammData.trading_fee
    lpToken = ammData.lp_token
    auctionSlot = ammData.auction_slot
  } else if (deletedData) {
    const [lb1, lb2] = buildDeletedBalances(deletedData)
    balance1 = lb1
    balance2 = lb2
    tradingFee = 0 // Not available in deleted AMM node
    lpToken = {
      currency: deletedData.lpToken.currency,
      issuer: deletedData.lpToken.issuer,
      value: deletedData.lpToken.value,
    }
  }

  const [asset1, asset2] = orderAssets(balance1, balance2)
  const hasData = !!ammData || !!deletedData

  return (
    <Page ammAccountId={ammAccountId}>
      {ammAccountId && isLoading && <Loader />}
      {ammAccountId && !isLoading && hasData && (
        <>
          <AMMPoolHeader asset1={asset1} asset2={asset2} />

          {isDeleted && (
            <div className="amm-deleted-banner">
              <div className="deleted-label">
                <InfoIcon className="deleted-info-icon" aria-hidden="true" />
                {t('amm_pool_deleted_label')}
              </div>
              <div className="deleted-message">
                {t('amm_pool_deleted_text')}
              </div>
            </div>
          )}

          <div className="amm-pool-info-cards">
            <BasicInfoCard
              ammAccountId={ammAccountId}
              tradingFee={tradingFee}
              createdTimestamp={createdTimestamp}
              lpTokenCurrency={lpToken?.currency}
            />
            {!isDeleted && (
              <MarketDataCard
                losData={losData}
                balance1={balance1}
                balance2={balance2}
                lpTokenBalance={lpToken?.value}
              />
            )}
            {!isDeleted && (
              <AuctionCard
                auctionSlot={auctionSlot}
                tvlUsd={losData?.tvl_usd}
                lpTokenBalance={lpToken?.value}
                tradingFee={tradingFee}
              />
            )}
          </div>

          {isMainnet && (
            <TVLVolumeChart
              data={(trendsData?.data_points || []).map(
                (point: HistoricalDataPoint) => ({
                  date: point.date,
                  tvl:
                    displayCurrency === 'usd' ? point.tvl_usd : point.tvl_xrp,
                  volume:
                    displayCurrency === 'usd'
                      ? point.trading_volume_usd
                      : point.trading_volume_xrp,
                }),
              )}
              isLoading={trendsLoading}
              displayCurrency={displayCurrency}
              setDisplayCurrency={setDisplayCurrency}
              onTimeRangeChange={setChartTimeRange}
            />
          )}

          <AMMPoolTablePicker
            ammAccountId={ammAccountId}
            tab={tab}
            isMainnet={isMainnet}
            lpToken={lpToken}
            tvlUsd={losData?.tvl_usd}
            isDeleted={isDeleted}
          />
        </>
      )}
      <Tooltip tooltip={tooltip} />
    </Page>
  )
}

export default AMMPool
