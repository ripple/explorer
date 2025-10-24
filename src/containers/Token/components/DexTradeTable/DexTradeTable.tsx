import { useTranslation } from 'react-i18next'
import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Account } from '../../../shared/components/Account'
import { Loader } from '../../../shared/components/Loader'
import { useTooltip, Tooltip } from '../../../shared/components/Tooltip'
import HoverIcon from '../../../shared/images/hover.svg'
import ArrowIcon from '../../../shared/images/down_arrow.svg'
import NoInfo from '../../../shared/images/no_info.svg'
import './styles.scss'
import '../tables-mobile.scss'
import { Pagination } from '../../../shared/components/Pagination'
import { ExplorerAmount } from '../../../shared/types'
import { ResponsiveTimestamp } from '../ResponsiveTimestamp'
import { Amount } from '../../../shared/components/Amount'
import Currency from '../../../shared/components/Currency'
import { shortenAccount, shortenTxHash } from '../../../shared/utils'
import { parseAmount } from '../../../shared/NumberFormattingUtils'
import { useLanguage } from '../../../shared/hooks'

export interface LOSDEXTransaction {
  hash: string
  ledger: number
  timestamp: number
  from: string
  to: string
  amount_in: ExplorerAmount
  amount_out: ExplorerAmount
  rate: number | null
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
  hasMore?: boolean
  hasPrevPage?: boolean
  sortField?: string
  setSortField?: (field: string) => void
  sortOrder?: 'asc' | 'desc'
  setSortOrder?: (order: 'asc' | 'desc') => void
  onRefresh?: () => void
}

export const DexTradeTable = ({
  transactions,
  isLoading = false,
  totalTrades,
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
}: DexTradeTableProps) => {
  const { t } = useTranslation()
  const language = useLanguage()
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
            const scrollTop = window.scrollY + rect.top - 200 // Scroll higher to show tabs and table headers
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

  const formatDexType = (type: string | undefined) => {
    if (!type) {
      return '--'
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
        // Set to timestamp field with desc order by default
        setSortField('timestamp')
        setSortOrder('desc')
      }
    }
  }

  const renderTransaction = (tx: LOSDEXTransaction, idx: number) => (
    <tr key={`${tx.hash}-${tx.ledger}-${idx}`}>
      <td className="tx-hash">
        <Link to={`/transactions/${tx.hash}`}>{shortenTxHash(tx.hash)}</Link>
      </td>

      <td className="tx-ledger">
        <Link to={`/ledgers/${tx.ledger}`}>{tx.ledger}</Link>
      </td>
      <td className="tx-timestamp">
        <ResponsiveTimestamp timestamp={tx.timestamp} lang={language} />
      </td>
      <td className="tx-type">{formatDexType(tx.type)}</td>
      <td className="tx-from">
        <span className="text-truncate">
          <Account displayText={shortenAccount(tx.from)} account={tx.from} />
        </span>
      </td>
      <td className="tx-to">
        <span className="text-truncate">
          <Account displayText={shortenAccount(tx.to)} account={tx.to} />
        </span>
      </td>
      <td className="tx-amount-in">
        <Amount
          value={{
            currency: tx.amount_in.currency,
            issuer: tx.amount_in.issuer,
            amount: parseAmount(tx.amount_in.amount),
          }}
          displayIssuer
          shortenIssuer
          displayCurrency={String(tx.amount_in.currency) !== 'XRP'}
        />
      </td>
      <td className="tx-amount-out">
        <Amount
          value={{
            currency: tx.amount_out.currency,
            issuer: tx.amount_out.issuer,
            amount: parseAmount(tx.amount_out.amount),
          }}
          displayIssuer
          shortenIssuer
          displayCurrency={String(tx.amount_out.currency) !== 'XRP'}
        />
      </td>

      <td className="tx-amount-rate">
        1{' '}
        <Currency
          currency={String(tx.amount_in.currency)}
          link={false}
          displaySymbol={false}
        />{' '}
        = {tx.rate !== null ? parseAmount(tx.rate) : '--'}{' '}
        <Currency
          currency={String(tx.amount_out.currency)}
          link={false}
          displaySymbol={false}
        />
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
              title={t('refresh_data')}
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
                  <th className="tx-hash">{t('tx_hash')}</th>
                  <th className="tx-ledger">{t('ledger')}</th>
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
                  <th className="tx-type">{t('token_page.dex_type')}</th>
                  <th className="tx-from">{t('from')}</th>
                  <th className="tx-to">{t('to')}</th>
                  <th className="tx-amount-in">
                    <span className="sort-header">
                      {t('amount_in')}
                      {renderTextTooltip(t('token_page.dex_amount_in_tooltip'))}
                    </span>
                  </th>
                  <th className="tx-amount-out">
                    <span className="sort-header">
                      {t('amount_out')}
                      {renderTextTooltip(
                        t('token_page.dex_amount_out_tooltip'),
                      )}
                    </span>
                  </th>
                  <th className="tx-amount-rate">
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
        <div className="empty-state-message">
          <NoInfo className="empty-state-icon" alt="No data" />
          <div className="empty-state-text">
            {t('token_page.dex_no_trades')}
          </div>
        </div>
      )}
    </div>
  )
}
