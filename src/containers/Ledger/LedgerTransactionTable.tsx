import { useTranslation } from 'react-i18next'
import { Loader } from '../shared/components/Loader'
import { TransactionTableProps } from '../shared/components/TransactionTable/TransactionTable'
import { LedgerTransactionTableRow } from './LedgerTransactionTableRow'

export const LedgerTransactionTable = ({
  emptyMessage = undefined,
  loading = false,
  transactions = [],
}: TransactionTableProps) => {
  const { t } = useTranslation()

  const renderListItem = (tx: any) => (
    <LedgerTransactionTableRow tx={tx} key={tx.hash} />
  )

  return (
    <>
      <ol className="transaction-table">
        <li
          className="transaction-li transaction-li-header"
          data-testid="transaction-li-header"
        >
          <div className="col col-type">{t('transaction_type')}</div>
          <div className="col col-account">{t('account')}</div>
          <div className="col col-sequence">{t('sequence_number_short')}</div>
          <div className="col col-fee">{t('transaction_cost_short')}</div>
        </li>
        {!transactions || (!loading && transactions.length === 0) ? (
          <div className="empty-transactions-message">
            {emptyMessage || t('no_transactions_message')}
          </div>
        ) : (
          transactions.map(renderListItem)
        )}
      </ol>
      {loading && <Loader />}
    </>
  )
}
