import { FunctionComponent, HTMLAttributes, MouseEventHandler } from 'react'
import { useTranslation } from 'react-i18next'
import { TransactionTableRow } from './TransactionTableRow'
import { Loader } from '../Loader'
import { LoadMoreButton } from '../../LoadMoreButton'
import './styles.scss'

export type TransactionTableProps = HTMLAttributes<HTMLElement> & {
  transactions?: any[]
  emptyMessage?: string
  loading: boolean
  onLoadMore?: MouseEventHandler
  hasAdditionalResults?: boolean
  hasTokensColumn?: boolean
}

type TransactionTableComponent = FunctionComponent<TransactionTableProps> & {}

export const TransactionTable: TransactionTableComponent = ({
  hasAdditionalResults = false,
  emptyMessage,
  loading = false,
  onLoadMore = () => {},
  transactions = [],
  hasTokensColumn,
}: TransactionTableProps) => {
  const { t } = useTranslation()

  const renderListItem = (tx: any) => (
    <TransactionTableRow
      tx={tx}
      hasTokensColumn={hasTokensColumn}
      key={tx.hash}
    />
  )

  const renderLoadMore = () =>
    hasAdditionalResults && <LoadMoreButton onClick={onLoadMore} />

  return (
    <>
      <ol className="transaction-table" title="transaction-table">
        <li className="transaction-li transaction-li-header">
          {hasTokensColumn && (
            <div className="col col-token" title="col-token">
              {' '}
              {t('token')}{' '}
            </div>
          )}
          <div className="col col-account">{t('account')}</div>
          <div className="col col-type">{t('transaction_type')}</div>
          <div className="col col-status">{t('status')}</div>
          <div className="col col-date">{t('transactions.date_header')}</div>
        </li>
        {!transactions || (!loading && transactions.length === 0) ? (
          <div className="empty-transactions-message">
            {emptyMessage || t('no_transactions_message')}
          </div>
        ) : (
          transactions.map(renderListItem)
        )}
      </ol>
      {loading ? <Loader /> : renderLoadMore()}
    </>
  )
}
