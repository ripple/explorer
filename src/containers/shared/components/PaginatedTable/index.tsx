import './styles.scss'
import { useState, useMemo, ReactNode } from 'react'

function getPageItems(current: number, total: number) {
  const pages: (number | 'dots')[] = []
  const push = (v: number | 'dots') => pages.push(v)
  const addRange = (s: number, e: number) => {
    for (let i = s; i <= e; i += 1) {
      push(i)
    }
  }

  if (total <= 7) {
    addRange(1, total)
    return pages
  }

  if (current <= 4) {
    addRange(1, 5)
    push('dots')
    push(total)
    return pages
  }
  if (current >= total - 3) {
    push(1)
    push('dots')
    addRange(total - 4, total)
    return pages
  }

  push(1)
  push('dots')
  addRange(current - 2, current + 2)
  push('dots')
  push(total)
  return pages
}

export interface PaginatedTableProps {
  data: any[]
  pageSize?: number
  tableStructure: (paginatedData: any[]) => ReactNode
}

export function PaginatedTable({
  data,
  pageSize = 10,
  tableStructure,
}: PaginatedTableProps) {
  const [currentPage, setCurrentPage] = useState(1)

  const totalPages = Math.max(1, Math.ceil(data.length / pageSize))

  // Calculate paginated data
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return data.slice(start, start + pageSize)
  }, [currentPage, data, pageSize])

  const items = getPageItems(currentPage, totalPages)
  const prevDisabled = currentPage === 1
  const nextDisabled = currentPage === totalPages

  const pagination =
    totalPages > 1 ? (
      <div
        className="table-pagination"
        role="navigation"
        aria-label="Table pagination"
      >
        <button
          type="button"
          className="table-pg-btn"
          disabled={prevDisabled}
          aria-label="First page"
          onClick={() => setCurrentPage(1)}
        >
          «
        </button>

        <button
          type="button"
          className="table-pg-btn"
          disabled={prevDisabled}
          aria-label="Previous page"
          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
        >
          ‹
        </button>

        {items.map((it, index) =>
          it === 'dots' ? (
            <span
              className="table-pg-ellipsis"
              key={`dots-${index < items.length / 2 ? 'start' : 'end'}`}
            >
              …
            </span>
          ) : (
            <button
              type="button"
              key={it}
              className={`table-pg-btn ${it === currentPage ? 'is-active' : ''}`}
              aria-current={it === currentPage ? 'page' : undefined}
              onClick={() => setCurrentPage(it as number)}
            >
              {it}
            </button>
          ),
        )}

        <button
          type="button"
          className="table-pg-btn"
          disabled={nextDisabled}
          aria-label="Next page"
          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
        >
          ›
        </button>

        <button
          type="button"
          className="table-pg-btn"
          disabled={nextDisabled}
          aria-label="Last page"
          onClick={() => setCurrentPage(totalPages)}
        >
          »
        </button>
      </div>
    ) : null

  return (
    <div>
      {tableStructure(paginatedData)}
      {pagination}
    </div>
  )
}
