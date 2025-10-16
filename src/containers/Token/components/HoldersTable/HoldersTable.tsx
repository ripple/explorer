import { useTranslation } from 'react-i18next'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Loader } from '../../../shared/components/Loader'
import { Pagination } from '../../../shared/components/Pagination'
import { parseAmount, parsePercent } from '../../../Tokens/TokensTable'
import './styles.scss'
import '../tables-mobile.scss'
import { truncateString } from '../../utils/stringFormatting'

export interface XRPLHolder {
  rank: number
  account: string
  balance: number
  percent: number
  value_usd: number
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

const DEFAULT_EMPTY_VALUE = '--' // Used in renderHolder

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
              <th className="count sticky-1">{t('token_page.holders_rank')}</th>
              <th className="name-col sticky-2">{t('account')}</th>
              <th className="name-col sticky-2">
                {t('token_page.holders_num_tokens')}
              </th>
              <th className="name-col sticky-2">
                {t('token_page.holders_percent_supply')}
              </th>
              <th className="name-col sticky-2">
                {t('token_page.holders_usd_value')}
              </th>
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
          onPageChange={onPageChange}
          pageSize={pageSize}
          scrollToTop={null}
        />
      )}
    </div>
  ) : (
    <div>{t('token_page.holders_no_holders')}</div>
  )
}
