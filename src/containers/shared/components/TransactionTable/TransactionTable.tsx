import React, { MouseEventHandler } from 'react'
import { useTranslation } from 'react-i18next'
import { TransactionTableRow } from './TransactionTableRow'
import Loader from '../Loader'
import './styles.scss'

type TransactionTableProps = React.HTMLAttributes<HTMLElement> & {
  transactions: any[] | undefined
  emptyMessage?: string
  loading: boolean
  onLoadMore: MouseEventHandler
  hasAdditionalResults: boolean | undefined
}

type TransactionTableComponent =
  React.FunctionComponent<TransactionTableProps> & {}

const TransactionTable: TransactionTableComponent = ({
  hasAdditionalResults,
  emptyMessage,
  loading = false,
  onLoadMore,
  transactions = [],
}: TransactionTableProps) => {
  const { t } = useTranslation()

  const renderListItem = (tx: any) => (
    <TransactionTableRow tx={tx} key={tx.hash} />
  )

  const renderLoadMore = () =>
    hasAdditionalResults && (
      <button type="button" className="load-more-btn" onClick={onLoadMore}>
        {t('load_more_action')}
      </button>
    )

  return (
    <div className="section transactions-table">
      <ol className="account-transactions">
        <li className="transaction-li transaction-li-header">
          <div className="col-account">{t('account')}</div>
          <div className="col-type">{t('transaction_type')}</div>
          <div className="col-status">{t('status')}</div>
          <div className="col-date">{t('transactions.date_header')}</div>
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
    </div>
  )
}

TransactionTable.defaultProps = {
  emptyMessage: undefined,
}

export default TransactionTable
