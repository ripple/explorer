import { useTranslation } from 'react-i18next'
import { useEffect, useRef } from 'react'
import { Loader } from '../../../shared/components/Loader'
import { Pagination } from '../../../shared/components/Pagination'
import './styles.scss'
import '../tables-mobile.scss'
import {
  parseAmount,
  parsePercent,
  parsePrice,
} from '../../../shared/NumberFormattingUtils'
import { shortenAccount } from '../../../shared/utils'
import { Account } from '../../../shared/components/Account'

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
}

export const HoldersTable = ({
  holders,
  isHoldersDataLoading = false,
  totalHolders,
  currentPage,
  onPageChange,
  pageSize,
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
      <td className="holder-rank">{holder.rank}</td>
      <td className="tx-hash">
        <Account
          account={holder.account}
          displayText={shortenAccount(holder.account)}
        />
      </td>
      <td className="tx-ledger">{parseAmount(holder.balance)}</td>
      <td className="tx-percent-supply">{parsePercent(holder.percent)}</td>
      <td className="tx-value">{parsePrice(holder.value_usd)}</td>
    </tr>
  )

  return holders.length > 0 || isHoldersDataLoading ? (
    <div className="tokens-table">
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
