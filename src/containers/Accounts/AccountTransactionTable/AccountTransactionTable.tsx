import { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { useInfiniteQuery } from 'react-query'

import { TransactionTable } from '../../shared/components/TransactionTable/TransactionTable'
import { useAnalytics } from '../../shared/analytics'
import SocketContext from '../../shared/SocketContext'

import { getAccountTransactions } from '../../../rippled'

export interface AccountTransactionsTableProps {
  accountId: string
  currencySelected?: string
  hasTokensColumn: boolean
}

export const AccountTransactionTable = ({
  accountId,
  hasTokensColumn,
  currencySelected = 'XRP',
}: AccountTransactionsTableProps) => {
  const { t } = useTranslation()
  const { trackException } = useAnalytics()
  const rippledSocket = useContext(SocketContext)

  const {
    data,
    error,
    isFetching: loading,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery<any, Error>(
    ['fetchTransactions', accountId],
    ({ pageParam = '' }) =>
      getAccountTransactions(
        accountId,
        undefined,
        pageParam,
        undefined,
        rippledSocket,
      ).catch((errorResponse) => {
        const errorLocation = `account transactions ${accountId} at ${pageParam}`
        trackException(`${errorLocation} --- ${JSON.stringify(errorResponse)}`)

        throw new Error('get_account_transactions_failed')
      }),
    {
      getNextPageParam: (lastPage) => lastPage.marker,
    },
  )

  const filterTransactions = () => {
    let processedTransactions = data?.pages?.reduce((txArray, page: any) => {
      if (page.transactions) {
        return txArray.concat(page.transactions)
      }
      return txArray
    }, [])

    if (currencySelected !== 'XRP') {
      processedTransactions = processedTransactions?.filter(
        (tx) =>
          !currencySelected ||
          (currencySelected &&
            JSON.stringify(tx).includes(
              `"currency":"${currencySelected.toUpperCase()}"`,
            )),
      )
    }
    return processedTransactions
  }

  const transactions = filterTransactions()
  const tryLoading = transactions?.length === 0 && data?.pages[0]?.transactions
  const emptyMessage = tryLoading
    ? 'get_account_transactions_try'
    : error?.message
  return (
    <TransactionTable
      transactions={transactions}
      loading={loading}
      hasTokensColumn={hasTokensColumn}
      emptyMessage={emptyMessage && t(emptyMessage as any)}
      onLoadMore={() => fetchNextPage()}
      hasAdditionalResults={hasNextPage}
    />
  )
}
