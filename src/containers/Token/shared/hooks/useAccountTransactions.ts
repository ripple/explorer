import { useContext, useEffect, useMemo, useState } from 'react'
import { useInfiniteQuery } from 'react-query'

import { useAnalytics } from '../../../shared/analytics'
import SocketContext from '../../../shared/SocketContext'
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
}

/**
 * Hook to fetch paginated account transactions filtered by token.
 *
 * Transactions are filtered client-side after fetching from rippled.
 * If a fetched page contains no matching transactions but more pages exist,
 * automatically fetches additional pages (up to MAX_AUTO_FETCH_ATTEMPTS)
 * to find matching transactions.
 */
export function useAccountTransactions({
  account,
  tokenId,
  limit,
}: UseAccountTransactionsOptions) {
  const { trackException } = useAnalytics()
  const rippledSocket = useContext(SocketContext)

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
        rippledSocket,
      ).catch((errorResponse: Error) => {
        const errorLocation = `transactions ${account}.${tokenId} at ${pageParam}`
        trackException(`${errorLocation} --- ${JSON.stringify(errorResponse)}`)
        throw new Error('get_account_transactions_failed')
      }),
    {
      getNextPageParam: (lastPage) => lastPage.marker,
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

  const lastPageWasEmpty = lastPageTransactionCount === 0
  const canAutoFetch = hasNextPage === true && !isLoading
  const [autoFetchAttempts, setAutoFetchAttempts] = useState(0)
  const hasRemainingAttempts = autoFetchAttempts < MAX_AUTO_FETCH_ATTEMPTS
  // Auto-fetch if the last page returned no matching transactions
  const shouldAutoFetch =
    lastPageWasEmpty && canAutoFetch && hasRemainingAttempts

  useEffect(() => {
    if (!shouldAutoFetch) {
      return undefined
    }

    const timer = setTimeout(() => {
      setAutoFetchAttempts((prev) => prev + 1)
      fetchNextPage()
    }, AUTO_FETCH_DELAY_MS)

    return () => clearTimeout(timer)
  }, [shouldAutoFetch, fetchNextPage])

  // Keep loading true while auto-fetch is pending to prevent UI flickering
  // between "Load More" button and loading spinner
  const loading = isLoading || shouldAutoFetch

  return {
    data,
    error,
    loading,
    fetchNextPage,
    hasNextPage: hasNextPage ?? false,
  }
}
