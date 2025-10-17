import './cursorPagination.scss'
import Arrow from '../../images/right-vector.svg'

type Props = {
  currentPage: number
  onPageChange: (page: number) => void
  hasNextPage?: boolean
  hasPrevPage?: boolean
  className?: string
  scrollToTop?: number | null
  totalItems?: number
  pageSize?: number
}

/**
 * CursorPagination Component
 *
 * A pagination component for cursor-based pagination with page numbers.
 * Shows page numbers for the current batch of cached data.
 * Designed for use with APIs that support cursor-based pagination.
 *
 * @param currentPage - The current page number
 * @param onPageChange - Callback when page changes
 * @param hasNextPage - Whether there's a next page available
 * @param hasPrevPage - Whether there's a previous page available
 * @param className - Additional CSS classes
 * @param scrollToTop - Scroll position after page change (null to disable)
 * @param totalItems - Total number of items in cache (used to calculate total pages)
 * @param pageSize - Number of items per page (default: 10)
 */
export const CursorPagination = ({
  currentPage,
  onPageChange,
  hasNextPage = false,
  hasPrevPage = false,
  className = '',
  scrollToTop = 100,
  totalItems = 0,
  pageSize = 10,
}: Props) => {
  // Don't show pagination if we can't go anywhere
  if (!hasNextPage && !hasPrevPage) return null

  // Calculate total pages based on cached items
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))

  // Generate array of page numbers to display
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1)

  const handlePageChange = (page: number) => {
    onPageChange(page)
    if (scrollToTop !== null && scrollToTop !== undefined) {
      window.scrollTo({ top: scrollToTop, behavior: 'smooth' })
    }
  }

  return (
    <nav
      className={`cursor-pagination ${className}`}
      aria-label="Cursor Pagination"
    >
      {hasPrevPage && (
        <button
          className="page-btn first-page-btn"
          type="button"
          onClick={() => handlePageChange(1)}
          aria-label="First page"
          title="Go to first page"
        >
          <Arrow className="first-page" />
          <Arrow className="first-page" />
        </button>
      )}

      <button
        className="page-btn prev-btn"
        type="button"
        onClick={() => hasPrevPage && handlePageChange(currentPage - 1)}
        disabled={!hasPrevPage}
        aria-label="Previous page"
      >
        <Arrow className="prev" />
      </button>

      <ul className="page-list">
        {pageNumbers.map((page) => (
          <li key={page}>
            <button
              type="button"
              className={`page-number ${page === currentPage ? 'active' : ''}`}
              onClick={() => handlePageChange(page)}
            >
              {page}
            </button>
          </li>
        ))}
      </ul>

      <button
        className="page-btn next-btn"
        type="button"
        onClick={() => hasNextPage && handlePageChange(currentPage + 1)}
        disabled={!hasNextPage}
        aria-label="Next page"
      >
        <Arrow className="next" />
      </button>
    </nav>
  )
}
