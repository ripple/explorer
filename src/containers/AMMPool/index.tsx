import { FC, PropsWithChildren, useContext, useEffect, useState } from 'react'
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
import { TVLVolumeChart } from './TVLVolumeChart'
import { fetchAMMPoolData, fetchAMMCreatedTimestamp } from './api'
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

export const AMMPool = () => {
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
      onError: (e: any) => {
        trackException(
          `Error fetching AMM info for ${ammAccountId} --- ${JSON.stringify(e)}`,
        )
        setError(e.code)
      },
    },
  )

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

  const ammData = ammInfo?.amm
  const balance1 = ammData ? formatAmount(ammData.amount) : null
  const balance2 = ammData ? formatAmount(ammData.amount2) : null

  // Order assets: XRP always on the right; if neither is XRP, sort alphabetically
  let asset1 = balance1
  let asset2 = balance2
  if (asset1 && asset2 && asset1.currency === 'XRP') {
    const temp = asset2
    asset2 = asset1
    asset1 = temp
  }

  return (
    <Page ammAccountId={ammAccountId}>
      {ammAccountId && ammInfoLoading && <Loader />}
      {ammAccountId && !ammInfoLoading && ammData && (
        <>
          <AMMPoolHeader asset1={asset1} asset2={asset2} />

          <div className="amm-pool-info-cards">
            <BasicInfoCard
              ammAccountId={ammAccountId}
              tradingFee={ammData.trading_fee}
              createdTimestamp={createdTimestamp}
              lpTokenCurrency={ammData.lp_token?.currency}
            />
            {isMainnet && losData && (
              <MarketDataCard
                losData={losData}
                balance1={balance1}
                balance2={balance2}
                lpTokenBalance={ammData.lp_token?.value}
              />
            )}
            <AuctionCard
              auctionSlot={ammData.auction_slot}
              tvlUsd={losData?.tvl_usd}
              lpTokenBalance={ammData.lp_token?.value}
              tradingFee={ammData.trading_fee}
            />
          </div>

          {isMainnet && (
            <TVLVolumeChart
              ammAccountId={ammAccountId}
              displayCurrency={displayCurrency}
              setDisplayCurrency={setDisplayCurrency}
            />
          )}

          <AMMPoolTablePicker
            ammAccountId={ammAccountId}
            tab={tab}
            isMainnet={isMainnet}
            lpToken={ammData.lp_token}
            asset1={asset1}
            asset2={asset2}
            tvlUsd={losData?.tvl_usd}
          />
        </>
      )}
    </Page>
  )
}

export default AMMPool
