import { useTranslation } from 'react-i18next'
import { useEffect, useRef } from 'react'
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

const DEFAULT_EMPTY_VALUE = '--'

export const HoldersTable = ({
  holders,
  isHoldersDataLoading = false,
  totalHolders,
  currentPage,
  onPageChange,
  pageSize,
  scrollRef,
}: HoldersTableProps) => {
  const { t } = useTranslation()
  const tableRef = useRef<HTMLTableElement>(null)

  // Scroll to top of table when page changes
  useEffect(() => {
    if (!isHoldersDataLoading) {
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
  }, [currentPage, isHoldersDataLoading])

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
        <table className="basic" ref={tableRef}>
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
