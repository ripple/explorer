import { useTranslation } from 'react-i18next'
import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Account } from '../../../shared/components/Account'
import { Loader } from '../../../shared/components/Loader'
import ArrowIcon from '../../../shared/images/down_arrow.svg'
import './styles.scss'
import '../tables-mobile.scss'
import { Amount } from '../../../shared/components/Amount'
import { Pagination } from '../../../shared/components/Pagination'
import { formatDecimals } from '../../../Tokens/TokensTable'
import { ResponsiveTimestamp } from '../ResponsiveTimestamp'
import { truncateString } from '../../utils/stringFormatting'
import {
  getAmountAsNumber,
  DEFAULT_EMPTY_VALUE,
} from '../../utils/numberFormatting'

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
  scrollRef?: React.RefObject<HTMLDivElement>
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
  scrollRef,
  hasMore = false,
  hasPrevPage = false,
  sortField,
  setSortField,
  sortOrder,
  setSortOrder,
  onRefresh,
}: TransfersTableProps) => {
  const { t } = useTranslation()
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
    const fromAddress = tx.from || DEFAULT_EMPTY_VALUE
    const toAddress = tx.to || DEFAULT_EMPTY_VALUE
    const hasValidAmount = tx.amount && tx.amount.currency && tx.amount.issuer

    return (
      <tr key={`${tx.hash}-${tx.ledger}`}>
        <td className="tx-hash">
          <Link to={`/transactions/${tx.hash}`}>{truncateString(tx.hash)}</Link>
        </td>

        <td className="tx-ledger">
          <Link to={`/ledgers/${tx.ledger}`}>{tx.ledger}</Link>
        </td>
        <td className="tx-action">
          <div className="action-pill">{tx.action}</div>
        </td>
        <td className="tx-timestamp">
          <ResponsiveTimestamp timestamp={tx.timestamp} />
        </td>
        <td className="tx-from">
          <span className="text-truncate">
            {fromAddress !== DEFAULT_EMPTY_VALUE ? (
              <Account
                account={fromAddress}
                displayText={truncateString(fromAddress)}
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              DEFAULT_EMPTY_VALUE
            )}
          </span>
        </td>
        <td className="tx-to">
          <span className="text-truncate">
            {toAddress !== DEFAULT_EMPTY_VALUE ? (
              <Account
                account={toAddress}
                displayText={truncateString(toAddress)}
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              DEFAULT_EMPTY_VALUE
            )}
          </span>
        </td>
        <td className="tx-amount">
          {hasValidAmount ? (
            <Amount
              value={{
                currency: tx.amount.currency,
                issuer: tx.amount.issuer,
                amount: formatDecimals(
                  getAmountAsNumber({
                    currency: tx.amount.currency,
                    issuer: tx.amount.issuer,
                    amount: tx.amount.value,
                  }),
                  2,
                ),
              }}
              displayIssuer={false}
            />
          ) : (
            DEFAULT_EMPTY_VALUE
          )}
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
              title="Refresh data"
            >
              ↻
            </button>
          </div>
          <div className="table-wrap">
            <table className="basic" ref={tableRef}>
              <thead>
                <tr>
                  <th className="count sticky-1">{t('tx_hash')}</th>
                  <th className="name-col sticky-2">{t('ledger')}</th>
                  <th className="name-col sticky-2">{t('action')}</th>
                  <th
                    className="name-col sticky-2"
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
                  <th className="name-col sticky-2">{t('from')}</th>
                  <th className="name-col sticky-2">{t('to')}</th>
                  <th className="name-col sticky-2">{t('amount')}</th>
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
        <div>{t('token_page.transfers_no_transfers')}</div>
      )}
    </div>
  )
}
