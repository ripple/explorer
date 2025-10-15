import { useTranslation } from 'react-i18next'
import { FC } from 'react'
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
import { parseAmount, parsePercent } from '../../../Tokens/TokensTable'
import { ResponsiveTimestamp } from '../ResponsiveTimestamp'

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

function truncateString(address, startLength = 6, endLength = 6) {
  if (!address || address.length <= startLength + endLength) {
    return address // nothing to truncate
  }
  const start = address.slice(0, startLength)
  const end = address.slice(-endLength)
  return `${start}...${end}`
}

export const TransfersTable = ({
  transactions,
  isTransfersLoading,
  totalTransfers,
  currentPage,
  onPageChange,
  pageSize,
}: TransfersTableProps) => {
  const { t } = useTranslation()

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
          <Account account={tx.from} onClick={(e) => e.stopPropagation()} />
        </span>
      </td>
      <td className="tx-to">
        <span className="text-truncate">
          <Account account={tx.to} onClick={(e) => e.stopPropagation()} />
        </span>
      </td>
      <td className="tx-amount">{parseAmount(tx.amount.value, 2)}</td>
    </tr>
  )

  return transactions.length > 0 || isTransfersLoading ? (
    <div className="tokens-table">
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
        />
      )}
    </div>
  ) : (
    <div>No transfers found</div>
  )
}
