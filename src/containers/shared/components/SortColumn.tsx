import React from 'react'
import ArrowIcon from '../images/down_arrow.svg'
import '../css/sort.scss'

type SortOrder = 'asc' | 'desc'

interface SortTableProps {
  field: string
  label: string
  sortField: string
  sortOrder: SortOrder
  setSortField: (field: string) => void
  setSortOrder: (order: SortOrder) => void
}

const SortTableColumn: React.FC<SortTableProps> = ({
  field,
  label,
  sortField,
  sortOrder,
  setSortField,
  setSortOrder,
}) => {
  const handleClick = () => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortOrder('desc')
    }
  }

  return (
    <th className={field} onClick={handleClick} style={{ cursor: 'pointer' }}>
      <span className="sort-header">
        {label}
        {sortField === field && (
          <ArrowIcon
            className={`arrow ${sortOrder === 'asc' ? 'asc' : 'desc'}`}
          />
        )}
      </span>
    </th>
  )
}

export default SortTableColumn
