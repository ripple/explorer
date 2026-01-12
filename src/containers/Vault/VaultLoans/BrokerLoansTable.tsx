import { useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import SocketContext from '../../shared/SocketContext'
import { getAccountObjects } from '../../../rippled/lib/rippled'
import { useAnalytics } from '../../shared/analytics'
import { Loader } from '../../shared/components/Loader'
import { LoanRow, LoanData } from './LoanRow'

const ITEMS_PER_PAGE = 10

interface Props {
  brokerAccount: string
  loanBrokerId: string
  currency?: string
}

export const BrokerLoansTable = ({
  brokerAccount,
  loanBrokerId,
  currency = '',
}: Props) => {
  const { t } = useTranslation()
  const { trackException } = useAnalytics()
  const rippledSocket = useContext(SocketContext)
  const [currentPage, setCurrentPage] = useState(1)

  const { data: loans, isFetching: loading } = useQuery<LoanData[] | undefined>(
    ['getBrokerLoans', brokerAccount, loanBrokerId],
    async () => {
      const resp = await getAccountObjects(
        rippledSocket,
        brokerAccount,
        'loan',
      )
      // Filter loans by LoanBrokerID to ensure only loans for this broker
      return resp?.account_objects?.filter(
        (obj: LoanData) => obj.LoanBrokerID === loanBrokerId,
      )
    },
    {
      enabled: !!brokerAccount && !!loanBrokerId,
      onError: (e: any) => {
        trackException(
          `BrokerLoans ${brokerAccount} --- ${JSON.stringify(e)}`,
        )
      },
    },
  )

  if (loading) {
    return (
      <div className="broker-loans-loading">
        <Loader />
      </div>
    )
  }

  if (!loans || loans.length === 0) {
    return (
      <div className="broker-loans-empty">
        <p>{t('no_loans_message')}</p>
      </div>
    )
  }

  // Pagination logic
  const totalPages = Math.ceil(loans.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const paginatedLoans = loans.slice(startIndex, endIndex)

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  // Generate page numbers to display
  const getPageNumbers = (): (number | string)[] => {
    const pages: (number | string)[] = []

    if (totalPages <= 7) {
      // Show all pages if 7 or fewer
      for (let i = 1; i <= totalPages; i += 1) {
        pages.push(i)
      }
    } else {
      // Always show first page
      pages.push(1)

      if (currentPage > 3) {
        pages.push('...')
      }

      // Show pages around current
      const start = Math.max(2, currentPage - 1)
      const end = Math.min(totalPages - 1, currentPage + 1)

      for (let i = start; i <= end; i += 1) {
        pages.push(i)
      }

      if (currentPage < totalPages - 2) {
        pages.push('...')
      }

      // Always show last page
      pages.push(totalPages)
    }

    return pages
  }

  return (
    <div className="broker-loans-table">
      <div className="loans-table-header">
        <div className="header-cell loan-id">{t('loan_id')}</div>
        <div className="header-cell borrower">{t('borrower')}</div>
        <div className="header-cell amount-requested">{t('amount_requested')}</div>
        <div className="header-cell interest-rate">{t('interest_rate')}</div>
        <div className="header-cell outstanding-balance">{t('outstanding_balance')}</div>
        <div className="header-cell status">{t('status')}</div>
      </div>

      <div className="loans-table-body">
        {paginatedLoans.map((loan) => (
          <LoanRow key={loan.index} loan={loan} currency={currency} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="loans-pagination">
          <button
            type="button"
            className="pagination-btn prev"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            aria-label="Previous page"
          >
            &lt;
          </button>

          {getPageNumbers().map((page, index) =>
            typeof page === 'number' ? (
              <button
                type="button"
                key={page}
                className={`pagination-btn page ${currentPage === page ? 'active' : ''}`}
                onClick={() => handlePageChange(page)}
              >
                {page}
              </button>
            ) : (
              // eslint-disable-next-line react/no-array-index-key
              <span key={`ellipsis-${index}`} className="pagination-ellipsis">
                {page}
              </span>
            ),
          )}

          <button
            type="button"
            className="pagination-btn next"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            aria-label="Next page"
          >
            &gt;
          </button>

          <button
            type="button"
            className="pagination-btn last"
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
            aria-label="Last page"
          >
            &gt;&gt;
          </button>
        </div>
      )}
    </div>
  )
}
