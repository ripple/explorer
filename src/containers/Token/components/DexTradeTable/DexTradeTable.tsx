import { useTranslation } from 'react-i18next'
import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Account } from '../../../shared/components/Account'
import { Loader } from '../../../shared/components/Loader'
import { useTooltip, Tooltip } from '../../../shared/components/Tooltip'
import HoverIcon from '../../../shared/images/hover.svg'
import ArrowIcon from '../../../shared/images/down_arrow.svg'
import './styles.scss'
import '../tables-mobile.scss'
import { Pagination } from '../../../shared/components/Pagination'
import { ExplorerAmount } from '../../../shared/types'
import { formatDecimals } from '../../../Tokens/TokensTable'
import { ResponsiveTimestamp } from '../ResponsiveTimestamp'
import { Amount } from '../../../shared/components/Amount'
import { formatAndLocalizeNumberWith2DecimalsWithFallback } from '../../utils/numberFormatting'
import { truncateString } from '../../utils/stringFormatting'

export interface LOSDEXTransaction {
  hash: string
  ledger: number
  timestamp: number // format ripple epoch time
  from: string
  to: string
  amount_in: ExplorerAmount
  amount_out: ExplorerAmount
  rate: number | null // probably just calc on spot
  type?: string
  subtype?: string
}

interface DexTradeTableProps {
  transactions: LOSDEXTransaction[]
  isLoading?: boolean
  totalTrades: number
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

const DEFAULT_EMPTY_VALUE = '--'

export const DexTradeTable = ({
  transactions,
  isLoading = false,
  totalTrades,
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
}: DexTradeTableProps) => {
  const { t } = useTranslation()
  const { tooltip, showTooltip, hideTooltip } = useTooltip()
  const tableRef = useRef<HTMLTableElement>(null)

  // Scroll to top of table when page changes
  useEffect(() => {
    if (!isLoading) {
      // Use double requestAnimationFrame to ensure scroll happens after DOM updates
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          const tableContainer = tableRef.current?.closest('.tokens-table')
          if (tableContainer) {
            const rect = tableContainer.getBoundingClientRect()
            const scrollTop = window.scrollY + rect.top - 120 // Scroll higher to show table headers
            window.scrollTo({ top: scrollTop, behavior: 'smooth' })
          }
        })
      })
    }
  }, [currentPage, isLoading])

  const renderTextTooltip = (tooltipText: string, yOffset = 60) => (
    <HoverIcon
      className="hover"
      onMouseOver={(e: React.MouseEvent<SVGSVGElement>) => {
        const rect = e.currentTarget.getBoundingClientRect()
        showTooltip('text', e, tooltipText, {
          x: rect.left - 10,
          y: rect.top - yOffset,
        })
      }}
      onMouseLeave={() => hideTooltip()}
    />
  )

  const formatDexType = (type: string) => {
    if (!type) {
      return DEFAULT_EMPTY_VALUE
    }
    if (type === 'orderBook') {
      return 'Order Book'
    }
    if (type === 'amm') {
      return 'AMM'
    }
    return type
  }

  const handleTimestampSort = () => {
    if (setSortField && setSortOrder) {
      if (sortField === 'timestamp') {
        // Toggle sort order
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
      } else {
        // Set to timestamp field with desc order
        setSortField('timestamp')
        setSortOrder('desc')
      }
    }
  }

  const renderTransaction = (tx: LOSDEXTransaction, idx: number) => (
    <tr key={`${tx.hash}-${tx.ledger}-${idx}`}>
      <td className="tx-hash">
        <Link to={`/transactions/${tx.hash}`}>{truncateString(tx.hash)}</Link>
      </td>

      <td className="tx-ledger">
        <Link to={`/ledgers/${tx.ledger}`}>{tx.ledger}</Link>
      </td>
      <td className="tx-timestamp">
        <ResponsiveTimestamp timestamp={tx.timestamp} />
      </td>
      <td className="tx-type">
        {tx.type ? formatDexType(tx.type) : DEFAULT_EMPTY_VALUE}
      </td>
      <td className="tx-from">
        <span className="text-truncate">
          <Account
            displayText={truncateString(tx.from)}
            account={tx.from}
            onClick={(e) => e.stopPropagation()}
          />
        </span>
      </td>
      <td className="tx-to">
        <span className="text-truncate">
          <Account
            displayText={truncateString(tx.to)}
            account={tx.to}
            onClick={(e) => e.stopPropagation()}
          />
        </span>
      </td>
      <td className="tx-amount-in">
        <Amount
          value={{
            currency: tx.amount_in.currency,
            issuer: tx.amount_in.issuer,
            amount: formatDecimals(Number(tx.amount_in.amount), 2),
          }}
          displayIssuer
          shortenIssuer
        />
      </td>
      <td className="tx-amount-out">
        <Amount
          value={{
            currency: tx.amount_out.currency,
            issuer: tx.amount_out.issuer,
            amount: formatDecimals(Number(tx.amount_out.amount), 2),
          }}
          displayIssuer
          shortenIssuer
        />
      </td>

      <td className="tx-amount-rate">
        {formatAndLocalizeNumberWith2DecimalsWithFallback(tx.rate)}
      </td>
    </tr>
  )

  return (
    <div className="tokens-table">
      <Tooltip tooltip={tooltip} />
      {isLoading && <Loader />}

      {!isLoading && transactions && transactions.length > 0 && (
        <>
          <div className="notice-with-controls">
            <div className="data-notice">{t('token_page.dex_data_notice')}</div>
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
            <table
              className="basic"
              key={`dex-table-page-${currentPage}`}
              ref={tableRef}
            >
              <thead>
                <tr>
                  <th className="count sticky-1">{t('tx_hash')}</th>
                  <th className="name-col sticky-2">{t('ledger')}</th>
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
                  <th className="name-col sticky-2">
                    {t('token_page.dex_type')}
                  </th>
                  <th className="name-col sticky-2">{t('from')}</th>
                  <th className="name-col sticky-2">{t('to')}</th>
                  <th className="name-col sticky-2">
                    <span className="sort-header">
                      {t('amount_in')}
                      {renderTextTooltip(t('token_page.dex_amount_in_tooltip'))}
                    </span>
                  </th>
                  <th className="name-col sticky-2">
                    <span className="sort-header">
                      {t('amount_out')}
                      {renderTextTooltip(
                        t('token_page.dex_amount_out_tooltip'),
                      )}
                    </span>
                  </th>
                  <th className="name-col sticky-2">
                    <span className="sort-header">
                      {t('rate')}
                      {renderTextTooltip(t('token_page.dex_rate_tooltip'))}
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx, idx) => renderTransaction(tx, idx))}
              </tbody>
            </table>
          </div>

          {(hasMore || hasPrevPage) && (
            <Pagination
              currentPage={currentPage}
              onPageChange={onPageChange}
              totalItems={totalTrades}
              pageSize={pageSize}
              scrollToTop={null}
              showLastPage={!hasMore}
            />
          )}
        </>
      )}

      {!isLoading && (!transactions || transactions.length === 0) && (
        <div>{t('token_page.dex_no_trades')}</div>
      )}
    </div>
  )
}
