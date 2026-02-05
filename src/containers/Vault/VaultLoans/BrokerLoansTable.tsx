import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { LoanRow, LoanData } from './LoanRow'
import { LSF_LOAN_DEFAULT, LSF_LOAN_IMPAIRED } from './utils'
import { Pagination } from '../../shared/components/Pagination/Pagination'
import FilterIcon from '../../shared/images/filter.svg'

const ITEMS_PER_PAGE = 10

type LoanFilter = 'all' | 'default' | 'impaired'

interface AssetInfo {
  currency: string
  issuer?: string
  mpt_issuance_id?: string
}

interface Props {
  loans: LoanData[] | undefined
  currency?: string
  displayCurrency: string
  asset?: AssetInfo
}

export const BrokerLoansTable = ({
  loans,
  currency = '',
  displayCurrency,
  asset,
}: Props) => {
  const { t } = useTranslation()
  const [currentPage, setCurrentPage] = useState(1)
  const [filter, setFilter] = useState<LoanFilter>('all')

  if (!loans || loans.length === 0) {
    return (
      <div className="broker-loans-empty">
        <p>{t('no_loans_message')}</p>
      </div>
    )
  }

  // Filter loans based on selected filter
  const filteredLoans = loans.filter((loan) => {
    if (filter === 'all') return true
    if (filter === 'default') {
      // eslint-disable-next-line no-bitwise
      return (loan.Flags ?? 0) & LSF_LOAN_DEFAULT
    }
    if (filter === 'impaired') {
      // eslint-disable-next-line no-bitwise
      return (loan.Flags ?? 0) & LSF_LOAN_IMPAIRED
    }
    return true
  })

  // Handle filter change and reset pagination
  const handleFilterChange = (newFilter: LoanFilter) => {
    setFilter(newFilter)
    setCurrentPage(1)
  }

  // Pagination logic
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const paginatedLoans = filteredLoans.slice(startIndex, endIndex)

  return (
    <div className="broker-loans-table">
      <div className="loans-filter-bar">
        <div className="filter-buttons">
          <button
            type="button"
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => handleFilterChange('all')}
          >
            {t('all_loans')}
          </button>
          <button
            type="button"
            className={`filter-btn ${filter === 'default' ? 'active' : ''}`}
            onClick={() => handleFilterChange('default')}
          >
            {t('loan_status_default')}
          </button>
          <button
            type="button"
            className={`filter-btn ${filter === 'impaired' ? 'active' : ''}`}
            onClick={() => handleFilterChange('impaired')}
          >
            {t('loan_status_impaired')}
          </button>
          <div className="filter-indicator">
            <FilterIcon className="filter-icon" />
          </div>
        </div>
      </div>

      <div className="loans-table-header">
        <div className="header-cell loan-id">{t('loan_id')}</div>
        <div className="header-cell borrower">{t('borrower')}</div>
        <div className="header-cell amount-requested">
          {t('amount_requested')}
        </div>
        <div className="header-cell interest-rate">{t('interest_rate')}</div>
        <div className="header-cell outstanding-balance">
          {t('outstanding_balance')}
        </div>
        <div className="header-cell status">{t('status')}</div>
      </div>

      <div className="loans-table-body">
        {paginatedLoans.map((loan) => (
          <LoanRow
            key={loan.index}
            loan={loan}
            currency={currency}
            displayCurrency={displayCurrency}
            asset={asset}
          />
        ))}
      </div>

      <Pagination
        totalItems={filteredLoans.length}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        pageSize={ITEMS_PER_PAGE}
        scrollToTop={null}
        className="loans-pagination"
      />
    </div>
  )
}
