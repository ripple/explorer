import { useTranslation } from 'react-i18next'
import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Account } from '../../../../shared/components/Account'
import { Loader } from '../../../../shared/components/Loader'
import { EmptyStateMessage } from '../../../../shared/components/EmptyStateMessage'
import ArrowIcon from '../../../../shared/images/down_arrow.svg'
import './styles.scss'
import '../tables-mobile.scss'
import { Pagination } from '../../../../shared/components/Pagination'
import { ResponsiveTimestamp } from '../ResponsiveTimestamp'
import { shortenAccount, shortenTxHash } from '../../../../shared/utils'
import { parseAmount } from '../../../../shared/NumberFormattingUtils'
import { useLanguage } from '../../../../shared/hooks'

export interface LOSTransfer {
  hash: string
  ledger: number
  action: string
  timestamp: number
  from: string
  to: string
  amount: {
    currency: string
    issuer: string
    value: string
  }
}

interface TransfersTableProps {
  transactions: LOSTransfer[]
  isTransfersLoading?: boolean
  totalTransfers: number
  currentPage: number
  onPageChange: (page: number) => void
  pageSize: number
  hasMore?: boolean
  hasPrevPage?: boolean
  sortField?: string
  setSortField?: (field: string) => void
  sortOrder?: 'asc' | 'desc'
  setSortOrder?: (order: 'asc' | 'desc') => void
  onRefresh?: () => void
}

export const TransfersTable = ({
  transactions,
  isTransfersLoading = false,
  totalTransfers,
  currentPage,
  onPageChange,
  pageSize,
  hasMore = false,
  hasPrevPage = false,
  sortField,
  setSortField,
  sortOrder,
  setSortOrder,
  onRefresh,
}: TransfersTableProps) => {
  const { t } = useTranslation()
  const language = useLanguage()
  const tableRef = useRef<HTMLTableElement>(null)

  // Scroll to top of table when page changes
  useEffect(() => {
    if (!isTransfersLoading) {
      // Use double requestAnimationFrame to ensure scroll happens after DOM updates
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          const tableContainer = tableRef.current?.closest('.tokens-table')
          if (tableContainer) {
            const rect = tableContainer.getBoundingClientRect()
            const scrollTop = window.scrollY + rect.top - 200 // Scroll higher to show tabs and table headers
            window.scrollTo({ top: scrollTop, behavior: 'smooth' })
          }
        })
      })
    }
  }, [currentPage, isTransfersLoading])

  const handleTimestampSort = () => {
    if (setSortField && setSortOrder) {
      if (sortField === 'timestamp') {
        // Toggle sort order
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
      } else {
        // Set to timestamp field with desc order by default
        setSortField('timestamp')
        setSortOrder('desc')
      }
    }
  }

  const renderTransaction = (tx: LOSTransfer) => {
    // Safely handle missing fields
    const fromAddress = tx.from || '--'
    const toAddress = tx.to || '--'
    const hasValidAmount = tx.amount && tx.amount.currency && tx.amount.issuer

    return (
      <tr key={`${tx.hash}-${tx.ledger}`}>
        <td className="tx-hash">
          <Link to={`/transactions/${tx.hash}`}>{shortenTxHash(tx.hash)}</Link>
        </td>

        <td className="tx-ledger">
          <Link to={`/ledgers/${tx.ledger}`}>{tx.ledger}</Link>
        </td>
        <td className="tx-action">
          <div className="action-pill">{tx.action}</div>
        </td>
        <td className="tx-timestamp">
          <ResponsiveTimestamp timestamp={tx.timestamp} lang={language} />
        </td>
        <td className="tx-from">
          <span className="text-truncate">
            {fromAddress !== '--' ? (
              <Account
                account={fromAddress}
                displayText={shortenAccount(fromAddress)}
              />
            ) : (
              '--'
            )}
          </span>
        </td>
        <td className="tx-to">
          <span className="text-truncate">
            {toAddress !== '--' ? (
              <Account
                account={toAddress}
                displayText={shortenAccount(toAddress)}
              />
            ) : (
              '--'
            )}
          </span>
        </td>
        <td className="tx-amount">
          {hasValidAmount ? parseAmount(tx.amount.value) : '--'}
        </td>
      </tr>
    )
  }

  return (
    <div className="tokens-table">
      {isTransfersLoading && <Loader />}

      {!isTransfersLoading && transactions && transactions.length > 0 && (
        <>
          <div className="notice-with-controls">
            <div className="data-notice">
              {t('token_page.transfers_data_notice')}
            </div>
            <button
              type="button"
              className="refresh-button"
              onClick={onRefresh}
              title={t('refresh_data')}
            >
              ↻
            </button>
          </div>
          <div className="table-wrap">
            <table className="basic" ref={tableRef}>
              <thead>
                <tr>
                  <th className="tx-hash">{t('tx_hash')}</th>
                  <th className="tx-ledger">{t('ledger')}</th>
                  <th className="tx-action">{t('action')}</th>
                  <th
                    className="tx-timestamp"
                    onClick={handleTimestampSort}
                    style={{ cursor: 'pointer' }}
                  >
                    <span className="sort-header">
                      {t('timestamp')}
                      {sortField === 'timestamp' && (
                        <ArrowIcon
                          className={`arrow ${sortOrder === 'asc' ? 'asc' : 'desc'}`}
                        />
                      )}
                    </span>
                  </th>
                  <th className="tx-from">{t('from')}</th>
                  <th className="tx-to">{t('to')}</th>
                  <th className="tx-amount">{t('amount')}</th>
                </tr>
              </thead>
              <tbody>{transactions.map(renderTransaction)}</tbody>
            </table>
          </div>
          {(hasMore || hasPrevPage) && (
            <Pagination
              currentPage={currentPage}
              onPageChange={onPageChange}
              totalItems={totalTransfers}
              pageSize={pageSize}
              scrollToTop={null}
              showLastPage={!hasMore}
            />
          )}
        </>
      )}

      {!isTransfersLoading && (!transactions || transactions.length === 0) && (
        <EmptyStateMessage message={t('token_page.transfers_no_transfers')} />
      )}
    </div>
  )
}
