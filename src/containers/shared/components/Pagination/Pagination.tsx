import './pagination.scss'
import Arrow from '../../images/right-vector.svg'
import DoubleArrow from '../../images/double-right-vector.svg'

type Props = {
  totalItems: number
  currentPage: number
  onPageChange: (page: number) => void
  siblingCount?: number
  className?: string
  pageSize?: number
  scrollToTop?: number | null
  showLastPage?: boolean
}

const DOTS = '…'

function range(start: number, end: number) {
  const len = end - start + 1
  return Array.from({ length: len }, (_, i) => i + start)
}

function getPaginationRange({
  totalItems,
  siblingCount,
  currentPage,
  pageSize,
  showLastPage = true,
}: {
  totalItems: number
  siblingCount: number
  currentPage: number
  pageSize: number
  showLastPage?: boolean
}) {
  const totalPageCount = Math.max(1, Math.ceil(totalItems / pageSize))
  const totalPageNumbers = siblingCount * 2 + 5

  if (totalPageNumbers >= totalPageCount) {
    return range(1, totalPageCount)
  }

  const leftSiblingIndex = Math.max(currentPage - siblingCount, 1)
  const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPageCount)

  const showLeftDots = leftSiblingIndex > 2
  const showRightDots = rightSiblingIndex < totalPageCount - 2

  const firstPageIndex = 1
  const lastPageIndex = totalPageCount

  // If showLastPage is false, don't show the last page or the dots leading to it
  if (!showLastPage) {
    if (!showLeftDots) {
      const leftItemCount = 3 + 2 * siblingCount
      const leftRange = range(1, leftItemCount)
      return [...leftRange, DOTS]
    }

    if (showLeftDots) {
      const rightItemCount = 3 + 2 * siblingCount
      const rightRange = range(
        leftSiblingIndex,
        Math.min(rightSiblingIndex, totalPageCount),
      )
      return [firstPageIndex, DOTS, ...rightRange]
    }

    return [
      firstPageIndex,
      DOTS,
      ...range(leftSiblingIndex, rightSiblingIndex),
      DOTS,
    ]
  }

  if (!showLeftDots && showRightDots) {
    const leftItemCount = 3 + 2 * siblingCount
    const leftRange = range(1, leftItemCount)
    return [...leftRange, DOTS, lastPageIndex]
  }

  if (showLeftDots && !showRightDots) {
    const rightItemCount = 3 + 2 * siblingCount
    const rightRange = range(lastPageIndex - rightItemCount + 1, lastPageIndex)
    return [firstPageIndex, DOTS, ...rightRange]
  }

  return [
    firstPageIndex,
    DOTS,
    ...range(leftSiblingIndex, rightSiblingIndex),
    DOTS,
    lastPageIndex,
  ]
}

export const Pagination = ({
  totalItems,
  currentPage,
  onPageChange,
  siblingCount = 1,
  className = '',
  pageSize = 15,
  scrollToTop = 100,
  showLastPage = true,
}: Props) => {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))
  if (totalPages <= 1) return null

  const paginationRange = getPaginationRange({
    totalItems,
    siblingCount,
    currentPage,
    pageSize,
    showLastPage,
  })

  const canGoPrev = currentPage > 1
  const canGoNext = currentPage < totalPages

  const handlePageChange = (page: number) => {
    onPageChange(page)
    if (scrollToTop !== null && scrollToTop !== undefined) {
      window.scrollTo({ top: scrollToTop, behavior: 'auto' })
    }
  }

  return (
    <nav className={`pagination ${className}`} aria-label="Pagination">
      <button
        className="page-btn"
        type="button"
        onClick={() => canGoPrev && handlePageChange(1)}
        disabled={!canGoPrev}
      >
        <DoubleArrow className="prev" />
      </button>
      <button
        className="page-btn"
        type="button"
        onClick={() => canGoPrev && handlePageChange(currentPage - 1)}
        disabled={!canGoPrev}
      >
        <Arrow className="prev" />
      </button>

      <ul className="page-list">
        {paginationRange.map((item) => {
          if (item === DOTS) {
            return (
              <li key="dots" className="page-ellipsis">
                {DOTS}
              </li>
            )
          }
          const page = item as number
          return (
            <li key={page}>
              <button
                type="button"
                className={`page-number ${page === currentPage ? 'active' : ''}`}
                onClick={() => handlePageChange(page)}
              >
                {page}
              </button>
            </li>
          )
        })}
      </ul>

      <button
        className="page-btn"
        type="button"
        onClick={() => canGoNext && handlePageChange(currentPage + 1)}
        disabled={!canGoNext}
      >
        <Arrow className="next" />
      </button>
      {showLastPage && (
        <button
          className="page-btn"
          type="button"
          onClick={() => canGoNext && handlePageChange(totalPages)}
          disabled={!canGoNext}
        >
          <DoubleArrow className="next" />
        </button>
      )}
    </nav>
  )
}
