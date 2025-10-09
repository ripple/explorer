import { useTranslation } from 'react-i18next'
import { FC } from 'react'
import { Link } from 'react-router-dom'
import UpIcon from '../../../shared/images/ic_up.svg'
import DownIcon from '../../../shared/images/ic_down.svg'
import { Account } from '../../../shared/components/Account'
import SortTableColumn from '../../../shared/components/SortColumn'
import { Loader } from '../../../shared/components/Loader'
import { convertRippleDate } from '../../../../rippled/lib/convertRippleDate'
import './styles.scss'
import { Amount } from '../../../shared/components/Amount'
import { Pagination } from '../../../shared/components/Pagination'
import { ExplorerAmount } from '../../../shared/types'

type SortOrder = 'asc' | 'desc'

interface SocialLink {
  type: string
  url: string
}

export interface LOSDEXTransaction {
  hash: string
  ledger: number
  timestamp: number // format ripple epoch time
  from: string
  to: string
  amount_in: ExplorerAmount
  amount_out: ExplorerAmount
  rate: number | null // probably just calc on spot
}

interface DexTradeTableProps {
  transactions: LOSDEXTransaction[]
  isLoading?: boolean
  totalTrades: number
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

const formatDecimals = (
  val: number,
  decimals: number = DEFAULT_DECIMALS,
): string => {
  const rounded = Number(val.toFixed(decimals))

  if (rounded === 0 && val !== 0) {
    const str = val.toPrecision(1)
    return Number(str).toString()
  }

  return val.toFixed(decimals).replace(/\.?0+$/, '')
}

const parseAmount = (
  value: string | number,
  decimals: number = DEFAULT_DECIMALS,
): string => {
  const valueNumeric = Number(value)

  if (valueNumeric >= 1_000_000_000) {
    return `${formatDecimals(valueNumeric / 1_000_000_000, decimals)}B`
  }
  if (valueNumeric >= 1_000_000) {
    return `${formatDecimals(valueNumeric / 1_000_000, decimals)}M`
  }
  if (valueNumeric >= 10_000) {
    return `${formatDecimals(valueNumeric / 1_000, decimals)}K`
  }

  return formatDecimals(valueNumeric)
}

const parsePercent = (percent: number): string => `${percent.toFixed(2)}%`

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

export const DexTradeTable = ({
  transactions,
  isLoading,
  totalTrades,
  currentPage,
  onPageChange,
  pageSize,
}: DexTradeTableProps) => {
  const { t } = useTranslation()

  console.log('DexTradeTable props:', {
    transactions: transactions?.length,
    isLoading,
    totalTrades,
    currentPage,
    pageSize,
    transactionsData: transactions,
  })

  const renderTransaction = (tx: LOSDEXTransaction) => (
    <tr>
      <td className="tx-hash">
        <Link to={`/transactions/${tx.hash}`}>{truncateString(tx.hash)}</Link>
      </td>

      <td className="tx-ledger">
        <Link to={`/ledgers/${tx.ledger}`}>{tx.ledger}</Link>
      </td>
      <td className="tx-timestamp">
        {new Date(convertRippleDate(tx.timestamp)).toLocaleString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })}
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
        <Amount value={tx.amount_in} displayIssuer={false} />
      </td>
      <td className="tx-amount-out">
        <Amount value={tx.amount_out} displayIssuer={false} />
      </td>

      <td className="tx-amount-rate">{tx.rate}</td>
    </tr>
  )

  // Temporary debug return
  return (
    <div className="tokens-table">
      {isLoading && <Loader />}

      {!isLoading && transactions && transactions.length > 0 && (
        <div className="table-wrap">
          <table className="basic">
            <thead>
              <tr>
                <th className="count sticky-1">{t('tx_hash')}</th>
                <th className="name-col sticky-2">{t('ledger')}</th>
                <th className="name-col sticky-2">{t('timestamp')}</th>
                <th className="name-col sticky-2">{t('from')}</th>
                <th className="name-col sticky-2">{t('to')}</th>
                <th className="name-col sticky-2">{t('amount_in')}</th>
                <th className="name-col sticky-2">{t('amount_out')}</th>
                <th className="name-col sticky-2">{t('rate')}</th>
              </tr>
            </thead>
            <tbody>{transactions.map(renderTransaction)}</tbody>
          </table>
        </div>
      )}

      {!isLoading && totalTrades > 0 && (
        <Pagination
          totalItems={totalTrades}
          currentPage={currentPage}
          onPageChange={onPageChange}
          pageSize={pageSize}
        />
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
