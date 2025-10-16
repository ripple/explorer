import { useTranslation } from 'react-i18next'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Account } from '../../../shared/components/Account'
import { Loader } from '../../../shared/components/Loader'
import { useTooltip, Tooltip } from '../../../shared/components/Tooltip'
import HoverIcon from '../../../shared/images/hover.svg'
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
}

const DEFAULT_EMPTY_VALUE = '--' // Used in formatDexType

export const DexTradeTable = ({
  transactions,
  isLoading,
  totalTrades,
  currentPage,
  onPageChange,
  pageSize,
  scrollRef,
}: DexTradeTableProps) => {
  const { t } = useTranslation()
  const { tooltip, showTooltip, hideTooltip } = useTooltip()

  // Scroll to top of table container when page changes
  useEffect(() => {
    if (scrollRef?.current && !isLoading) {
      const containerTop =
        scrollRef.current.getBoundingClientRect().top + window.scrollY
      // Subtract 100px to show headers and tabs above the table
      window.scrollTo({ top: containerTop - 100, behavior: 'smooth' })
    }
  }, [currentPage, isLoading, scrollRef])

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
      return 'Orderbook'
    }
    if (type === 'amm') {
      return 'AMM'
    }
    return type
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
          <div className="data-notice">
            Data displayed is from 7/1/2025, 12:00:00 AM UTC onwards
          </div>
          <div className="table-wrap">
            <table className="basic" key={`dex-table-page-${currentPage}`}>
              <thead>
                <tr>
                  <th className="count sticky-1">{t('tx_hash')}</th>
                  <th className="name-col sticky-2">{t('ledger')}</th>
                  <th className="name-col sticky-2">{t('timestamp')}</th>
                  <th className="name-col sticky-2">Type</th>
                  <th className="name-col sticky-2">{t('from')}</th>
                  <th className="name-col sticky-2">{t('to')}</th>
                  <th className="name-col sticky-2">
                    <span className="sort-header">
                      {t('amount_in')}
                      {renderTextTooltip(
                        'The amount of tokens received by the "To" account in the trade',
                      )}
                    </span>
                  </th>
                  <th className="name-col sticky-2">
                    <span className="sort-header">
                      {t('amount_out')}
                      {renderTextTooltip(
                        'The amount of tokens sent out by the "To" account in the trade',
                      )}
                    </span>
                  </th>
                  <th className="name-col sticky-2">
                    <span className="sort-header">
                      {t('rate')}
                      {renderTextTooltip('Amount In / Amount Out')}
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx, idx) => renderTransaction(tx, idx))}
              </tbody>
            </table>
          </div>

          {totalTrades > 0 && (
            <Pagination
              totalItems={totalTrades}
              currentPage={currentPage}
              onPageChange={onPageChange}
              pageSize={pageSize}
              scrollToTop={null}
            />
          )}
        </>
      )}

      {!isLoading && (!transactions || transactions.length === 0) && (
        <div>
          No dex trades found (transactions:{' '}
          {transactions?.length || 'undefined'})
        </div>
      )}
    </div>
  )
}
