import { FC, PropsWithChildren, useState, useContext, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { useQuery } from 'react-query'
import Log from '../shared/log'
import { TokenHeader } from './TokenHeader'
import { TokenTransactionTable } from './TokenTransactionTable'
import NoMatch from '../NoMatch'

import './styles.scss'
import {
  NOT_FOUND,
  BAD_REQUEST,
  ORACLE_ACCOUNT,
  FETCH_INTERVAL_XRP_USD_ORACLE_MILLIS,
  DROPS_TO_XRP_FACTOR,
} from '../shared/utils'
import { useAnalytics } from '../shared/analytics'
import { ErrorMessages } from '../shared/Interfaces'
import { TOKEN_ROUTE } from '../App/routes'
import { useRouteParams } from '../shared/routing'
import { Loader } from '../shared/components/Loader'
import { getToken } from '../../rippled'
import SocketContext from '../shared/SocketContext'
import { getAccountLines, getAMMInfo } from '../../rippled/lib/rippled'
import getTokenHolders from '../../rippled/holders'
import { getTransfers } from '../../rippled/tokenTx'
import {
  DexTrade,
  dexTradesPaginationService,
} from './services/dexTradesPagination'

const ERROR_MESSAGES: ErrorMessages = {
  default: {
    title: 'generic_error',
    hints: ['not_your_fault'],
  },
  [NOT_FOUND]: {
    title: 'account_not_found',
    hints: ['check_account_id'],
  },
  [BAD_REQUEST]: {
    title: 'invalid_xrpl_address',
    hints: ['check_account_id'],
  },
}

const getErrorMessage = (error) =>
  ERROR_MESSAGES[error] || ERROR_MESSAGES.default

const Page: FC<PropsWithChildren<{ accountId: string }>> = ({
  accountId,
  children,
}) => (
  <div className="token-page">
    <Helmet title={`${accountId.substring(0, 12)}...`} />
    {children}
  </div>
)

export const Token = () => {
  const { trackScreenLoaded } = useAnalytics()
  const { token = '' } = useRouteParams(TOKEN_ROUTE)
  const [currency, accountId] = token.split('.')

  // pagination state for holders table
  const [holdersPage, setHoldersPage] = useState(1)
  const holdersPageSize = 20

  // pagination state for transfers table
  const [transfersPage, setTransfersPage] = useState(1)
  const transfersPageSize = 10

  // pagination state for dex trades table
  const [dexTradesPage, setDexTradesPage] = useState(1)
  const dexTradesPageSize = 10

  // get basic token stats and info
  const {
    data: tokenData,
    error: tokenDataError,
    isLoading: isTokenDataLoading,
  } = useQuery({
    queryKey: ['token', currency, accountId],
    queryFn: () => getToken(currency, accountId),
  })

  // get top holders information for calculations and holders table
  const { data: holdersData, isLoading: isHoldersDataLoading } = useQuery({
    queryKey: ['holders', currency, accountId, holdersPage],
    queryFn: () => {
      const offset = (holdersPage - 1) * holdersPageSize
      return getTokenHolders(currency, accountId, holdersPageSize, offset)
    },
  })

  // get XRP to USD rate
  const rippledSocket = useContext(SocketContext)
  const fetchXRPToUSDRate = () =>
    getAccountLines(rippledSocket, ORACLE_ACCOUNT, 1).then(
      (accountLines) => accountLines.lines[0]?.limit ?? 0.0,
    )
  const { data: XRPUSDPrice = 0.0 } = useQuery(
    ['fetchXRPToUSDRate'],
    () => fetchXRPToUSDRate(),
    {
      refetchInterval: FETCH_INTERVAL_XRP_USD_ORACLE_MILLIS,
      onError: (error) => {
        Log.error(error)
        return 0.0
      },
    },
  )

  // get dex trades with pagination service
  const [dexTradesData, setDexTradesData] = useState<{
    trades: DexTrade[]
    totalTrades: number
    isLoading: boolean
  }>({
    trades: [],
    totalTrades: 0,
    isLoading: false,
  })

  useEffect(() => {
    const fetchDexTrades = async () => {
      if (!currency || !accountId) {
        return
      }

      try {
        const result = await dexTradesPaginationService.getDexTradesPage(
          currency,
          accountId,
          dexTradesPage,
          dexTradesPageSize,
        )

        console.log('[Token] Setting dex trades data:', {
          tradesLength: result.trades.length,
          totalTrades: result.totalTrades,
          page: dexTradesPage,
          pageSize: dexTradesPageSize,
          startIndex: (dexTradesPage - 1) * dexTradesPageSize,
          endIndex: dexTradesPage * dexTradesPageSize,
          firstTradeHash: result.trades[0]?.hash,
          lastTradeHash: result.trades[result.trades.length - 1]?.hash,
        })

        setDexTradesData({
          trades: result.trades,
          totalTrades: result.totalTrades,
          isLoading: result.isLoading,
        })
      } catch (error) {
        console.error('Error fetching dex trades:', error)
        setDexTradesData({
          trades: [],
          totalTrades: 0,
          isLoading: false,
        })
      }
    }

    fetchDexTrades()
  }, [currency, accountId, dexTradesPage, dexTradesPageSize])

  // get transfers for tables
  const { data: transfers, isLoading: isTransfersLoading } = useQuery({
    queryKey: ['transfers', currency, accountId, transfersPage],
    queryFn: () => {
      const from = (transfersPage - 1) * transfersPageSize
      return getTransfers(currency, accountId, from, transfersPageSize)
    },
  })

  // get amm info for TVL calculation
  // note: only fetch xrp-<token> amm info to simplify API calls for most tokens
  const fetchAmmInfo = () =>
    getAMMInfo(
      rippledSocket,
      { currency: 'XRP' },
      { currency, issuer: accountId },
    ).then(
      (data) =>
        (Number(data.amm.amount) / DROPS_TO_XRP_FACTOR) * XRPUSDPrice * 2,
    )

  const { data: ammTvlData, isLoading: isAmmTvlLoading } = useQuery({
    queryKey: ['ammTvl', currency, accountId],
    queryFn: fetchAmmInfo,
    enabled: !!XRPUSDPrice, // only fetch if we have a valid XRP to USD price
  })

  // Reset pagination when token changes
  useEffect(() => {
    setHoldersPage(1)
    setTransfersPage(1)
    setDexTradesPage(1)
  }, [currency, accountId])

  useEffect(() => {
    trackScreenLoaded({
      issuer: accountId,
      currency_code: currency,
    })

    return () => {
      window.scrollTo(0, 0)
    }
  }, [accountId, currency, trackScreenLoaded])

  const renderError = () => {
    const message = getErrorMessage(tokenDataError)
    return <NoMatch title={message.title} hints={message.hints} />
  }

  if (tokenDataError) {
    return <Page accountId={accountId}>{renderError()}</Page>
  }

  return (
    <Page accountId={accountId}>
      {isTokenDataLoading ? (
        <Loader />
      ) : (
        tokenData && (
          <TokenHeader
            currency={currency}
            tokenData={tokenData}
            xrpUSDRate={XRPUSDPrice.toString()}
            holdersData={holdersData}
            isHoldersDataLoading={isHoldersDataLoading}
            ammTvlData={ammTvlData}
            isAmmTvlLoading={isAmmTvlLoading}
          />
        )
      )}

      {accountId && tokenData && (
        <div className="section">
          <TokenTransactionTable
            holdersData={holdersData}
            isHoldersDataLoading={isHoldersDataLoading}
            accountId={accountId}
            currency={currency}
            dexTrades={dexTradesData.trades}
            isDexTradesLoading={dexTradesData.isLoading}
            transfers={transfers}
            isTransfersLoading={isTransfersLoading}
            xrpUSDRate={XRPUSDPrice.toString()}
            tokenData={tokenData}
            holdersPage={holdersPage}
            setHoldersPage={setHoldersPage}
            holdersPageSize={holdersPageSize}
            transfersPage={transfersPage}
            setTransfersPage={setTransfersPage}
            transfersPageSize={transfersPageSize}
            dexTradesPage={dexTradesPage}
            setDexTradesPage={setDexTradesPage}
            dexTradesPageSize={dexTradesPageSize}
            totalDexTrades={dexTradesData.totalTrades}
          />
        </div>
      )}
      {!accountId && (
        <div style={{ textAlign: 'center', fontSize: '14px' }}>
          <h2>Enter an account ID in the search box</h2>
        </div>
      )}
    </Page>
  )
}
