import { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { useInfiniteQuery } from 'react-query'
import { ANALYTIC_TYPES, analytics } from '../../shared/utils'

import SocketContext from '../../shared/SocketContext'
import { TransactionTable } from '../../shared/components/TransactionTable/TransactionTable'
import { getAccountTransactions } from '../../../rippled'

export interface TokenTransactionsTableProps {
  accountId: string
  currency: string
}

export const TokenTransactionTable = ({
  accountId,
  currency,
}: TokenTransactionsTableProps) => {
  const rippledSocket = useContext(SocketContext)
  const { t } = useTranslation()

  const {
    data,
    error,
    isFetching: loading,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery<any, Error>(
    ['fetchTransactions', accountId, currency],
    ({ pageParam = '' }) =>
      getAccountTransactions(
        accountId,
        currency,
        pageParam,
        undefined,
        rippledSocket,
      ).catch((errorResponse) => {
        const errorLocation = `token transactions ${accountId}.${currency} at ${pageParam}`
        analytics(ANALYTIC_TYPES.exception, {
          exDescription: `${errorLocation} --- ${JSON.stringify(
            errorResponse,
          )}`,
        })

        throw new Error('get_account_transactions_failed')
      }),
    {
      getNextPageParam: (lastPage) => lastPage.marker,
    },
  )

  return (
    <TransactionTable
      transactions={data?.pages?.map((page: any) => page.transactions).flat()}
      loading={loading}
      emptyMessage={t(error?.message || ('' as any))}
      onLoadMore={() => fetchNextPage()}
      hasAdditionalResults={hasNextPage}
    />
  )
}
