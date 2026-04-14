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
import { detectLiquidatedAMM, LiquidatedAMMData } from './utils'
import { AuctionSlot, FormattedBalance, HistoricalDataPoint } from './types'
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
 * Build FormattedBalance objects from liquidated AMM data.
 * Liquidated pools have no live balances, so amount is 0.
 */
const buildLiquidatedBalances = (
  data: LiquidatedAMMData,
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
        // Don't set error yet — we'll try liquidated detection
      },
    },
  )

  // If amm_info failed, try to detect a liquidated AMM pool
  const ammInfoFailed = !ammInfoLoading && !ammInfo && !!ammAccountId
  const { data: liquidatedData, isFetching: liquidatedLoading } = useQuery(
    ['ammLiquidated', ammAccountId],
    () => detectLiquidatedAMM(rippledSocket, ammAccountId),
    {
      enabled: ammInfoFailed,
      onError: () => {
        // Both amm_info and liquidation detection failed
        setError(NOT_FOUND)
      },
    },
  )

  // If amm_info failed, liquidation check finished, and it's not a liquidated pool → show error
  useEffect(() => {
    if (ammInfoFailed && !liquidatedLoading && !liquidatedData) {
      setError(NOT_FOUND)
    }
  }, [ammInfoFailed, liquidatedLoading, liquidatedData])

  const isLiquidated = !!liquidatedData
  const isLoading = ammInfoLoading || (ammInfoFailed && liquidatedLoading)

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

  const [timeRange, setTimeRange] = useState<string>('6M')

  // Fetch historical trends (mainnet only)
  const { data: trendsData, isFetching: trendsLoading } = useQuery(
    ['ammTrends', ammAccountId, timeRange],
    () => fetchAMMHistoricalTrends(ammAccountId, timeRange),
    {
      enabled: !!ammAccountId && isMainnet,
      onError: (e: any) => {
        trackException(
          `Error fetching AMM trends for ${ammAccountId} --- ${JSON.stringify(e)}`,
        )
      },
    },
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

  // Build unified data from either live amm_info or liquidated metadata
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
  } else if (liquidatedData) {
    const [lb1, lb2] = buildLiquidatedBalances(liquidatedData)
    balance1 = lb1
    balance2 = lb2
    tradingFee = 0 // Not available in deleted AMM node
    lpToken = {
      currency: liquidatedData.lpToken.currency,
      issuer: liquidatedData.lpToken.issuer,
      value: liquidatedData.lpToken.value,
    }
  }

  const [asset1, asset2] = orderAssets(balance1, balance2)
  const hasData = !!ammData || !!liquidatedData

  return (
    <Page ammAccountId={ammAccountId}>
      {ammAccountId && isLoading && <Loader />}
      {ammAccountId && !isLoading && hasData && (
        <>
          <AMMPoolHeader asset1={asset1} asset2={asset2} />

          {isLiquidated && (
            <div className="amm-liquidated-banner">
              {t('amm_pool_liquidated')}
            </div>
          )}

          <div className="amm-pool-info-cards">
            <BasicInfoCard
              ammAccountId={ammAccountId}
              tradingFee={tradingFee}
              createdTimestamp={createdTimestamp}
              lpTokenCurrency={lpToken?.currency}
            />
            {!isLiquidated && isMainnet && losData && (
              <MarketDataCard
                losData={losData}
                balance1={balance1}
                balance2={balance2}
                lpTokenBalance={lpToken?.value}
              />
            )}
            {!isLiquidated && (
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
              onTimeRangeChange={setTimeRange}
            />
          )}

          <AMMPoolTablePicker
            ammAccountId={ammAccountId}
            tab={tab}
            isMainnet={isMainnet}
            lpToken={lpToken}
            tvlUsd={losData?.tvl_usd}
            isDeleted={isLiquidated}
          />
        </>
      )}
    </Page>
  )
}

export default AMMPool
