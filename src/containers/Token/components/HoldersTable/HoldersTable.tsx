import { useTranslation } from 'react-i18next'
import { FC, useEffect } from 'react'
import { Link } from 'react-router-dom'
import UpIcon from '../../../shared/images/ic_up.svg'
import DownIcon from '../../../shared/images/ic_down.svg'
import { Account } from '../../../shared/components/Account'
import SortTableColumn from '../../../shared/components/SortColumn'
import { Loader } from '../../../shared/components/Loader'
import { convertRippleDate } from '../../../../rippled/lib/convertRippleDate'
import { Amount } from '../../../shared/components/Amount'
import { Pagination } from '../../../shared/components/Pagination'
import { parseAmount, parsePercent } from '../../../Tokens/TokensTable'
import './styles.scss'
import '../tables-mobile.scss'

type SortOrder = 'asc' | 'desc'

interface SocialLink {
  type: string
  url: string
}

export interface XRPLHolder {
  rank: number
  account: string
  balance: number
  percent: number
  value_usd: number
  // last_active: number // format ripple epoch time
}

interface HoldersTableProps {
  holders: XRPLHolder[]
  isHoldersDataLoading?: boolean
  totalHolders: number
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

function truncateString(address, startLength = 6, endLength = 6) {
  if (!address || address.length <= startLength + endLength) {
    return address // nothing to truncate
  }
  const start = address.slice(0, startLength)
  const end = address.slice(-endLength)
  return `${start}...${end}`
}

export const HoldersTable = ({
  holders,
  isHoldersDataLoading,
  totalHolders,
  currentPage,
  onPageChange,
  pageSize,
  scrollRef,
}: HoldersTableProps) => {
  const { t } = useTranslation()

  // Scroll to top of table container when page changes
  useEffect(() => {
    if (scrollRef?.current && !isHoldersDataLoading) {
      const containerTop =
        scrollRef.current.getBoundingClientRect().top + window.scrollY
      // Subtract 100px to show headers and tabs above the table
      window.scrollTo({ top: containerTop - 100, behavior: 'smooth' })
    }
  }, [currentPage, isHoldersDataLoading, scrollRef])

  const handlePageChange = (page: number) => {
    onPageChange(page)
  }

  const renderHolder = (holder: XRPLHolder) => (
    <tr key={`${holder.account}-${holder.rank}`}>
      <td className="holder-rank">{holder.rank || DEFAULT_EMPTY_VALUE}</td>
      <td className="tx-hash">
        <Link to={`/accounts/${holder.account}`}>
          {truncateString(holder.account)}
        </Link>
      </td>
      <td className="tx-ledger">
        {holder.balance ? parseAmount(holder.balance, 2) : DEFAULT_EMPTY_VALUE}
      </td>
      <td className="tx-percent-supply">
        {holder.percent ? parsePercent(holder.percent) : DEFAULT_EMPTY_VALUE}
      </td>
      <td className="tx-value">${parseAmount(holder.value_usd, 2)}</td>
      {/* <td className="tx-last-active">
        {new Date(convertRippleDate(holder.last_active)).toLocaleString(
          'en-US',
          {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          },
        )}
      </td> */}
    </tr>
  )

  return holders.length > 0 || isHoldersDataLoading ? (
    <div className="holders-table">
      <div className="table-wrap">
        <table className="basic">
          <thead>
            <tr>
              <th className="count sticky-1">Rank</th>
              <th className="name-col sticky-2">{t('account')}</th>
              <th className="name-col sticky-2"># of Tokens</th>
              <th className="name-col sticky-2">% of Supply</th>
              <th className="name-col sticky-2">USD Value</th>
            </tr>
          </thead>
          <tbody>
            {isHoldersDataLoading ? (
              <tr>
                <td colSpan={5}>
                  <div className="mobile-loading">
                    <Loader />
                  </div>
                </td>
              </tr>
            ) : (
              holders.map(renderHolder)
            )}
          </tbody>
        </table>
      </div>
      {!isHoldersDataLoading && (
        <Pagination
          totalItems={totalHolders}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          pageSize={pageSize}
          scrollToTop={null}
        />
      )}
    </div>
  ) : (
    <div>No holders found</div>
  )
}
