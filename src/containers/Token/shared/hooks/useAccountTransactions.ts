import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useInfiniteQuery } from 'react-query'

import { useAnalytics } from '../../../shared/analytics'
import SocketContext, {
  ExplorerXrplClient,
} from '../../../shared/SocketContext'
import { getAccountTransactions } from '../../../../rippled'

/**
 * Maximum number of automatic page fetches when no transactions match the filter.
 * This prevents excessive API calls for accounts with many non-matching transactions.
 */
const MAX_AUTO_FETCH_ATTEMPTS = 10

/**
 * Delay between automatic fetch attempts in milliseconds.
 */
const AUTO_FETCH_DELAY_MS = 200

interface UseAccountTransactionsOptions {
  account: string
  /** Token identifier: currency code for IOU, MPT issuance ID for MPT */
  tokenId: string
  limit?: number
  /** Auto-fetch, uncapped, until this many matches load; "Load more" adds as many again */
  minResults?: number
  /** Query the P2P (Clio) server, which keeps full history, when configured */
  useP2PSocket?: boolean
  /** Number of times to retry a failed page fetch */
  retry?: number
}

/**
 * Hook to fetch paginated account transactions filtered by token.
 *
 * Transactions are filtered client-side after fetching from rippled.
 * If a fetched page contains no matching transactions but more pages exist,
 * automatically fetches additional pages (up to MAX_AUTO_FETCH_ATTEMPTS)
 * to find matching transactions. With minResults, it keeps fetching until
 * that many matches are loaded or there is no next page.
 */
export function useAccountTransactions({
  account,
  tokenId,
  limit,
  minResults = 0,
  useP2PSocket = false,
  retry = 0,
}: UseAccountTransactionsOptions) {
  const { trackException } = useAnalytics()
  const rippledSocket = useContext(SocketContext)
  // getAccountTransactions only sends a plain account_tx, so the P2P client works
  const querySocket = useP2PSocket
    ? ((rippledSocket?.p2pSocket ?? rippledSocket) as ExplorerXrplClient)
    : rippledSocket

  const {
    data,
    error,
    isFetching: isLoading,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery<any, Error>(
    ['fetchTransactions', account, tokenId],
    ({ pageParam = '' }) =>
      getAccountTransactions(
        account,
        tokenId,
        pageParam,
        limit,
        querySocket,
      ).catch((errorResponse: Error) => {
        const errorLocation = `transactions ${account}.${tokenId} at ${pageParam}`
        trackException(`${errorLocation} --- ${JSON.stringify(errorResponse)}`)
        throw new Error('get_account_transactions_failed')
      }),
    {
      getNextPageParam: (lastPage) => lastPage.marker,
      retry,
    },
  )

  // Check if the last fetched page returned 0 matching transactions
  const lastPageTransactionCount = useMemo(() => {
    const pages = data?.pages
    if (!pages || pages.length === 0) {
      return 0
    }

    return pages[pages.length - 1]?.transactions?.length || 0
  }, [data])

  const loadedCount = useMemo(
    () =>
      data?.pages.reduce(
        (count, page) => count + (page.transactions?.length || 0),
        0,
      ) ?? 0,
    [data],
  )
  const [targetCount, setTargetCount] = useState(minResults)
  // The hook stays mounted when navigating between tokens
  useEffect(() => {
    setTargetCount(minResults)
  }, [account, tokenId, minResults])

  const lastPageWasEmpty = lastPageTransactionCount === 0
  // Don't auto-fetch after a failure, or a failing page is re-requested forever
  const canAutoFetch = hasNextPage === true && !isLoading && !error
  const [autoFetchAttempts, setAutoFetchAttempts] = useState(0)
  const hasRemainingAttempts = autoFetchAttempts < MAX_AUTO_FETCH_ATTEMPTS
  // Auto-fetch if the last page returned no matching transactions, or until
  // minResults matches are loaded when set
  const shouldAutoFetch =
    canAutoFetch &&
    (minResults
      ? loadedCount < targetCount
      : lastPageWasEmpty && hasRemainingAttempts)

  // Re-run per loaded page: shouldAutoFetch can stay true across a fetch
  const pageCount = data?.pages.length ?? 0
  useEffect(() => {
    if (!shouldAutoFetch) {
      return undefined
    }

    const timer = setTimeout(() => {
      setAutoFetchAttempts((prev) => prev + 1)
      fetchNextPage()
    }, AUTO_FETCH_DELAY_MS)

    return () => clearTimeout(timer)
  }, [shouldAutoFetch, fetchNextPage, pageCount])

  // Keep loading true while auto-fetch is pending to prevent UI flickering
  // between "Load More" button and loading spinner
  const loading = isLoading || shouldAutoFetch

  // With minResults, "Load more" raises the target so empty pages are skipped
  const loadMore = useCallback(() => {
    setTargetCount(loadedCount + minResults)
    return fetchNextPage()
  }, [loadedCount, minResults, fetchNextPage])

  return {
    data,
    error,
    loading,
    fetchNextPage: minResults ? loadMore : fetchNextPage,
    hasNextPage: hasNextPage ?? false,
  }
}
