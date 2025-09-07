import { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { useInfiniteQuery } from 'react-query'

import { TransactionTable } from '../../shared/components/TransactionTable/TransactionTable'
import { useAnalytics } from '../../shared/analytics'
import SocketContext from '../../shared/SocketContext'

import { getAccountTransactions } from '../../../rippled'

export interface AccountTransactionsTableProps {
  accountId: string
  hasTokensColumn: boolean
}

export const AccountTransactionTable = ({
  accountId,
  hasTokensColumn,
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

  const transactions =
    data?.pages?.reduce(
      (allTransactions: any[], page: any) =>
        page.transactions
          ? allTransactions.concat(page.transactions)
          : allTransactions,
      [],
    ) || []

  const tryLoading = transactions.length === 0 && data?.pages[0]?.transactions
  const emptyMessage = tryLoading
    ? 'get_account_transactions_try'
    : error?.message
  return (
    <div className="transactions-section">
      <div className="transactions-header">
        <h3>{t('transactions')}</h3>
      </div>
      <TransactionTable
        transactions={transactions}
        loading={loading}
        hasTokensColumn={hasTokensColumn}
        emptyMessage={emptyMessage && t(emptyMessage as any)}
        onLoadMore={() => fetchNextPage()}
        hasAdditionalResults={hasNextPage}
      />
    </div>
  )
}
