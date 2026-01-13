import { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { useInfiniteQuery } from 'react-query'
import SocketContext from '../../shared/SocketContext'
import { getAccountTransactions } from '../../../rippled'
import { TransactionTable } from '../../shared/components/TransactionTable/TransactionTable'
import { useAnalytics } from '../../shared/analytics'
import './styles.scss'

interface Props {
  accountId: string
}

export const VaultTransactions = ({ accountId }: Props) => {
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
    ['fetchVaultTransactions', accountId],
    ({ pageParam = '' }) =>
      getAccountTransactions(
        accountId,
        undefined,
        pageParam,
        undefined,
        rippledSocket,
      ).catch((errorResponse) => {
        const errorLocation = `vault transactions ${accountId} at ${pageParam}`
        trackException(`${errorLocation} --- ${JSON.stringify(errorResponse)}`)
        throw new Error('get_vault_transactions_failed')
      }),
    {
      getNextPageParam: (lastPage) => lastPage.marker,
      enabled: !!accountId,
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

  return (
    <div className="vault-transactions-section">
      <h2 className="vault-transactions-title">{t('transactions')}</h2>
      <div className="vault-transactions-divider" />
      <TransactionTable
        transactions={transactions}
        loading={loading}
        emptyMessage={error?.message ? t(error.message as any) : undefined}
        onLoadMore={() => fetchNextPage()}
        hasAdditionalResults={hasNextPage}
        hasAmountColumn
      />
    </div>
  )
}
