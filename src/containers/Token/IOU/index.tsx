import { FC, PropsWithChildren, useState, useContext, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { useQuery } from 'react-query'
import { Header } from './Header'
import { TablePicker } from './TablePicker'
import NoMatch from '../../NoMatch'

import './styles.scss'
import '../shared/styles.scss'
import { NOT_FOUND, BAD_REQUEST, DROPS_TO_XRP_FACTOR } from '../../shared/utils'
import { useAnalytics } from '../../shared/analytics'
import { ErrorMessages } from '../../shared/Interfaces'
import { TOKEN_ROUTE } from '../../App/routes'
import { useRouteParams } from '../../shared/routing'
import { Loader } from '../../shared/components/Loader'
import SocketContext from '../../shared/SocketContext'
import { getAMMInfoByAssets } from '../../../rippled/lib/rippled'
import getTokenHolders from './api/holders'
import { paginationService as dexTradesPaginationService } from './services/dexTradesPagination'
import { paginationService as transfersPaginationService } from '../shared/services/transfersPagination'
import { useCursorPaginatedQuery } from '../../shared/hooks/useCursorPaginatedQuery'
import { PAGINATION_CONFIG, INITIAL_PAGE } from '../shared/constants'
import { useXRPToUSDRate } from '../../shared/hooks/useXRPToUSDRate'
import getToken from './api/token'

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

export const IOU = () => {
  const { trackScreenLoaded, trackException } = useAnalytics()
  const { token = '' } = useRouteParams(TOKEN_ROUTE)
  const [currency, accountId] = token.split('.')

  // Holders pagination
  const [holdersPage, setHoldersPage] = useState(INITIAL_PAGE)

  // get basic token stats and info
  const {
    data: tokenData,
    error: tokenDataError,
    isLoading: isTokenDataLoading,
  } = useQuery({
    queryKey: ['token', currency, accountId],
    queryFn: () => getToken(currency, accountId),
  })

  // Track token data API errors
  useEffect(() => {
    if (tokenDataError) {
      trackException(
        `token ${currency}.${accountId} --- ${JSON.stringify(tokenDataError)}`,
      )
    }
  }, [tokenDataError, currency, accountId, trackException])

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
  const XRPUSDPrice = useXRPToUSDRate()

  // get rippled socket for AMM info
  const rippledSocket = useContext(SocketContext)

  // DEX Trades — using shared hook
  const tokenId = `${currency}.${accountId}`
  const dexTrades = useCursorPaginatedQuery({
    service: dexTradesPaginationService,
    id: tokenId,
    pageSize: PAGINATION_CONFIG.DEX_TRADES_PAGE_SIZE,
    enabled: !!currency && !!accountId,
  })

  // Transfers — using shared hook
  const transfers = useCursorPaginatedQuery({
    service: transfersPaginationService,
    id: tokenId,
    pageSize: PAGINATION_CONFIG.TRANSFERS_PAGE_SIZE,
    enabled: !!currency && !!accountId,
  })

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
    setHoldersPage(INITIAL_PAGE)
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
          <Header
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
          <TablePicker
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
            dexTradesData={dexTrades.data?.items || []}
            dexTradesPagination={{
              currentPage: dexTrades.page,
              setCurrentPage: dexTrades.setPage,
              pageSize: PAGINATION_CONFIG.DEX_TRADES_PAGE_SIZE,
              total: dexTrades.data?.totalItems || 0,
              hasMore: dexTrades.data?.hasMore || false,
              hasPrevPage: dexTrades.page > 1,
            }}
            dexTradesSorting={{
              sortField: dexTrades.sortField,
              setSortField: dexTrades.setSortField,
              sortOrder: dexTrades.sortOrder,
              setSortOrder: dexTrades.setSortOrder,
            }}
            dexTradesLoading={dexTrades.isLoading}
            onRefreshDexTrades={dexTrades.refresh}
            transfersData={transfers.data?.items || []}
            transfersPagination={{
              currentPage: transfers.page,
              setCurrentPage: transfers.setPage,
              pageSize: PAGINATION_CONFIG.TRANSFERS_PAGE_SIZE,
              total: transfers.data?.totalItems || 0,
              hasMore: transfers.data?.hasMore || false,
              hasPrevPage: transfers.page > 1,
            }}
            transfersSorting={{
              sortField: transfers.sortField,
              setSortField: transfers.setSortField,
              sortOrder: transfers.sortOrder,
              setSortOrder: transfers.setSortOrder,
            }}
            transfersLoading={transfers.isLoading}
            onRefreshTransfers={transfers.refresh}
          />
        </div>
      )}
    </Page>
  )
}
