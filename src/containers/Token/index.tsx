import { FC, PropsWithChildren, useState, useContext, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { useQuery } from 'react-query'
import Log from '../shared/log'
import { TokenHeader } from './TokenHeader'
import { TokenTablePicker } from './TokenTablePicker/TokenTablePicker'
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
import { getAccountLines, getAMMInfoByAssets } from '../../rippled/lib/rippled'
import getTokenHolders from './api/holders'
import {
  DexTrade,
  dexTradesPaginationService,
} from './services/dexTradesPagination'
import { transfersPaginationService } from './services/transfersPagination'
import { PAGINATION_CONFIG, INITIAL_PAGE } from './constants'

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

const getErrorMessage = (error: unknown) =>
  ERROR_MESSAGES[error as string | number] || ERROR_MESSAGES.default

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

  // Pagination state
  const [holdersPage, setHoldersPage] = useState(INITIAL_PAGE)
  const [transfersPage, setTransfersPage] = useState(INITIAL_PAGE)
  const [dexTradesPage, setDexTradesPage] = useState(INITIAL_PAGE)

  // Sort state - default to timestamp desc (newest first)
  const [dexTradesSortField, setDexTradesSortField] =
    useState<string>('timestamp')
  const [dexTradesSortOrder, setDexTradesSortOrder] = useState<'asc' | 'desc'>(
    'desc',
  )
  const [transfersSortField, setTransfersSortField] =
    useState<string>('timestamp')
  const [transfersSortOrder, setTransfersSortOrder] = useState<'asc' | 'desc'>(
    'desc',
  )

  // Refresh counters to trigger re-fetches
  const [dexTradesRefreshCount, setDexTradesRefreshCount] = useState(0)
  const [transfersRefreshCount, setTransfersRefreshCount] = useState(0)

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
      const offset = (holdersPage - 1) * PAGINATION_CONFIG.HOLDERS_PAGE_SIZE
      return getTokenHolders(
        currency,
        accountId,
        PAGINATION_CONFIG.HOLDERS_PAGE_SIZE,
        offset,
      )
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
    hasMore: boolean
    hasPrevPage: boolean
  }>({
    trades: [],
    totalTrades: 0,
    isLoading: true,
    hasMore: false,
    hasPrevPage: false,
  })

  // get transfers with pagination service
  const [transfersData, setTransfersData] = useState<{
    transfers: any[]
    totalTransfers: number
    isLoading: boolean
    hasMore: boolean
    hasPrevPage: boolean
  }>({
    transfers: [],
    totalTransfers: 0,
    isLoading: true,
    hasMore: false,
    hasPrevPage: false,
  })

  // Handle sort changes - reset to page 1, clear cache, and set loading state
  useEffect(() => {
    setDexTradesPage(INITIAL_PAGE)
    setDexTradesData((prev) => ({ ...prev, isLoading: true }))
    dexTradesPaginationService.clearCache(
      currency,
      accountId,
      dexTradesSortField,
      dexTradesSortOrder,
    )
  }, [dexTradesSortField, dexTradesSortOrder, currency, accountId])

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
          PAGINATION_CONFIG.DEX_TRADES_PAGE_SIZE,
          dexTradesSortField,
          dexTradesSortOrder,
        )

        setDexTradesData({
          trades: result.trades,
          totalTrades: result.totalTrades,
          isLoading: result.isLoading,
          hasMore: result.hasMore,
          hasPrevPage: dexTradesPage > 1,
        })
      } catch (error) {
        setDexTradesData({
          trades: [],
          totalTrades: 0,
          isLoading: false,
          hasMore: false,
          hasPrevPage: dexTradesPage > 1,
        })
      }
    }

    fetchDexTrades()
  }, [
    currency,
    accountId,
    dexTradesPage,
    dexTradesSortField,
    dexTradesSortOrder,
    dexTradesRefreshCount,
  ])

  // Handle sort changes for transfers - reset to page 1, clear cache, and set loading state
  useEffect(() => {
    setTransfersPage(INITIAL_PAGE)
    setTransfersData((prev) => ({ ...prev, isLoading: true }))
    transfersPaginationService.clearCache(
      currency,
      accountId,
      transfersSortField,
      transfersSortOrder,
    )
  }, [transfersSortField, transfersSortOrder, currency, accountId])

  // get transfers with pagination service
  useEffect(() => {
    const fetchTransfers = async () => {
      if (!currency || !accountId) {
        return
      }

      try {
        const result = await transfersPaginationService.getTransfersPage(
          currency,
          accountId,
          transfersPage,
          PAGINATION_CONFIG.TRANSFERS_PAGE_SIZE,
          transfersSortField,
          transfersSortOrder,
        )

        setTransfersData({
          transfers: result.transfers,
          totalTransfers: result.totalTransfers,
          isLoading: result.isLoading,
          hasMore: result.hasMore,
          hasPrevPage: transfersPage > 1,
        })
      } catch (error) {
        setTransfersData({
          transfers: [],
          totalTransfers: 0,
          isLoading: false,
          hasMore: false,
          hasPrevPage: transfersPage > 1,
        })
      }
    }

    fetchTransfers()
  }, [
    currency,
    accountId,
    transfersPage,
    transfersSortField,
    transfersSortOrder,
    transfersRefreshCount,
  ])

  // Refresh handlers - reset to page 1, clear cache, and set loading state
  const handleRefreshDexTrades = () => {
    setDexTradesPage(INITIAL_PAGE)
    setDexTradesData((prev) => ({ ...prev, isLoading: true }))
    dexTradesPaginationService.clearCache(
      currency,
      accountId,
      dexTradesSortField,
      dexTradesSortOrder,
    )
    setDexTradesRefreshCount((prev) => prev + 1)
  }

  const handleRefreshTransfers = () => {
    setTransfersPage(INITIAL_PAGE)
    setTransfersData((prev) => ({ ...prev, isLoading: true }))
    transfersPaginationService.clearCache(
      currency,
      accountId,
      transfersSortField,
      transfersSortOrder,
    )
    setTransfersRefreshCount((prev) => prev + 1)
  }

  // get amm info for TVL calculation
  // note: only fetch xrp-<token> amm info to simplify API calls for most tokens
  const fetchAmmInfo = () =>
    getAMMInfoByAssets(
      rippledSocket,
      { currency: 'XRP' },
      { currency, issuer: accountId },
    ).then((data) => ({
      tvl: (Number(data.amm.amount) / DROPS_TO_XRP_FACTOR) * XRPUSDPrice * 2,
      account: data.amm.account,
    }))

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
          <TokenTablePicker
            accountId={accountId}
            currency={currency}
            xrpUSDRate={XRPUSDPrice.toString()}
            tokenData={tokenData}
            holdersData={holdersData}
            holdersPagination={{
              currentPage: holdersPage,
              setCurrentPage: setHoldersPage,
              pageSize: PAGINATION_CONFIG.HOLDERS_PAGE_SIZE,
              total: holdersData?.totalHolders || 0,
            }}
            holdersLoading={isHoldersDataLoading}
            dexTradesData={dexTradesData.trades}
            dexTradesPagination={{
              currentPage: dexTradesPage,
              setCurrentPage: setDexTradesPage,
              pageSize: PAGINATION_CONFIG.DEX_TRADES_PAGE_SIZE,
              total: dexTradesData.totalTrades,
              hasMore: dexTradesData.hasMore,
              hasPrevPage: dexTradesData.hasPrevPage,
            }}
            dexTradesSorting={{
              sortField: dexTradesSortField,
              setSortField: setDexTradesSortField,
              sortOrder: dexTradesSortOrder,
              setSortOrder: setDexTradesSortOrder,
            }}
            dexTradesLoading={dexTradesData.isLoading}
            onRefreshDexTrades={handleRefreshDexTrades}
            transfersData={transfersData.transfers}
            transfersPagination={{
              currentPage: transfersPage,
              setCurrentPage: setTransfersPage,
              pageSize: PAGINATION_CONFIG.TRANSFERS_PAGE_SIZE,
              total: transfersData.totalTransfers,
              hasMore: transfersData.hasMore,
              hasPrevPage: transfersData.hasPrevPage,
            }}
            transfersSorting={{
              sortField: transfersSortField,
              setSortField: setTransfersSortField,
              sortOrder: transfersSortOrder,
              setSortOrder: setTransfersSortOrder,
            }}
            transfersLoading={transfersData.isLoading}
            onRefreshTransfers={handleRefreshTransfers}
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
