import './cursorPagination.scss'
import Arrow from '../../images/right-vector.svg'

type Props = {
  currentPage: number
  onPageChange: (page: number) => void
  hasNextPage?: boolean
  hasPrevPage?: boolean
  className?: string
  scrollToTop?: number | null
}

/**
 * CursorPagination Component
 *
 * A simplified pagination component for cursor-based pagination.
 * Only allows navigation one page at a time (prev/next buttons).
 * Designed for use with APIs that support cursor-based pagination.
 *
 * @param currentPage - The current page number
 * @param onPageChange - Callback when page changes
 * @param hasNextPage - Whether there's a next page available
 * @param hasPrevPage - Whether there's a previous page available
 * @param className - Additional CSS classes
 * @param scrollToTop - Scroll position after page change (null to disable)
 */
export const CursorPagination = ({
  currentPage,
  onPageChange,
  hasNextPage = false,
  hasPrevPage = false,
  className = '',
  scrollToTop = 100,
}: Props) => {
  // Don't show pagination if we can't go anywhere
  if (!hasNextPage && !hasPrevPage) return null

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

      <span className="page-info">
        Page <span className="current-page">{currentPage}</span>
      </span>

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
