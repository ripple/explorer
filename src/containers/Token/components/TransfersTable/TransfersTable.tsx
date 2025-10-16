import { useTranslation } from 'react-i18next'
import { FC, useEffect } from 'react'
import { Link } from 'react-router-dom'
import UpIcon from '../../../shared/images/ic_up.svg'
import DownIcon from '../../../shared/images/ic_down.svg'
import { Account } from '../../../shared/components/Account'
import SortTableColumn from '../../../shared/components/SortColumn'
import { Loader } from '../../../shared/components/Loader'
import './styles.scss'
import '../tables-mobile.scss'
import { Amount } from '../../../shared/components/Amount'
import { Pagination } from '../../../shared/components/Pagination'
import {
  formatDecimals,
  parseAmount,
  parsePercent,
} from '../../../Tokens/TokensTable'
import { ResponsiveTimestamp } from '../ResponsiveTimestamp'
import { ExplorerAmount } from '../../../shared/types'
import { truncateString } from '../../utils/stringFormatting'

type SortOrder = 'asc' | 'desc'

interface SocialLink {
  type: string
  url: string
}

export interface LOSTransfer {
  hash: string
  ledger: number
  action: string
  timestamp: number // format ripple epoch time
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
}

const DEFAULT_DECIMALS = 1
const DEFAULT_EMPTY_VALUE = '--'

export const parseCurrencyAmount = (
  value: string,
  xrpPrice: number,
  decimals: number = DEFAULT_DECIMALS,
): string => {
  const usdValue = Number(value) * xrpPrice
  return `$${parseAmount(usdValue, decimals)}`
}

const TokenLogo: FC<{ icon: string | undefined }> = ({ icon }) =>
  icon ? (
    <object data={icon} className="icon">
      <div className="icon" />
    </object>
  ) : (
    <div className="icon no-logo" />
  )

const PriceChange: FC<{ percent: number }> = ({ percent }) => (
  <div className={`percent ${percent > 0 ? 'increase' : 'decrease'}`}>
    <div className="amount">
      {percent > 0
        ? parsePercent(percent)
        : parsePercent(percent).replace('-', '')}
    </div>
    {percent > 0 ? (
      <UpIcon className="arrow" />
    ) : (
      <DownIcon className="arrow" />
    )}
  </div>
)

export const TransfersTable = ({
  transactions,
  isTransfersLoading,
  totalTransfers,
  currentPage,
  onPageChange,
  pageSize,
  scrollRef,
}: TransfersTableProps) => {
  const { t } = useTranslation()

  // Scroll to top of table container when page changes
  useEffect(() => {
    if (scrollRef?.current && !isTransfersLoading) {
      const containerTop =
        scrollRef.current.getBoundingClientRect().top + window.scrollY
      // Subtract 100px to show headers and tabs above the table
      window.scrollTo({ top: containerTop - 100, behavior: 'smooth' })
    }
  }, [currentPage, isTransfersLoading, scrollRef])

  const renderTransaction = (tx: LOSTransfer) => (
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
          <Account
            account={tx.from}
            displayText={truncateString(tx.from)}
            onClick={(e) => e.stopPropagation()}
          />
        </span>
      </td>
      <td className="tx-to">
        <span className="text-truncate">
          <Account
            account={tx.to}
            displayText={truncateString(tx.to)}
            onClick={(e) => e.stopPropagation()}
          />
        </span>
      </td>
      <td className="tx-amount">
        <Amount
          value={{
            currency: tx.amount.currency,
            issuer: tx.amount.issuer,
            amount: formatDecimals(Number(tx.amount.value), 2),
          }}
          displayIssuer={false}
        />
      </td>
    </tr>
  )

  return transactions.length > 0 || isTransfersLoading ? (
    <div className="tokens-table">
      <div className="data-notice">
        Data displayed is from 7/1/2025, 12:00:00 AM UTC onwards
      </div>
      <div className="table-wrap">
        <table className="basic">
          <thead>
            <tr>
              <th className="count sticky-1">{t('tx_hash')}</th>
              <th className="name-col sticky-2">{t('ledger')}</th>
              <th className="name-col sticky-2">{t('action')}</th>
              <th className="name-col sticky-2">{t('timestamp')}</th>
              <th className="name-col sticky-2">{t('from')}</th>
              <th className="name-col sticky-2">{t('to')}</th>
              <th className="name-col sticky-2">{t('amount')}</th>
            </tr>
          </thead>
          <tbody>
            {isTransfersLoading ? (
              <tr>
                <td colSpan={7}>
                  <Loader />
                </td>
              </tr>
            ) : (
              transactions.map(renderTransaction)
            )}
          </tbody>
        </table>
      </div>
      {!isTransfersLoading && (
        <Pagination
          totalItems={totalTransfers}
          currentPage={currentPage}
          onPageChange={onPageChange}
          pageSize={pageSize}
          scrollToTop={null}
        />
      )}
    </div>
  ) : (
    <div>No transfers found</div>
  )
}
