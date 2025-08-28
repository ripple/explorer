import React from 'react'
import { useTranslation } from 'react-i18next'
import { useTooltip } from './Tooltip'
import ArrowIcon from '../images/down_arrow.svg'
import '../css/sort.scss'
import HoverIcon from '../images/hover.svg'

type SortOrder = 'asc' | 'desc'

interface SortTableProps {
  field: string
  label: string
  sortField: string
  sortOrder: SortOrder
  setSortField: (field: string) => void
  setSortOrder: (order: SortOrder) => void
  setPage: (page: number) => void
  tooltip?: boolean
}

const SortTableColumn: React.FC<SortTableProps> = ({
  field,
  label,
  sortField,
  sortOrder,
  setSortField,
  setSortOrder,
  setPage,
  tooltip = false,
}) => {
  const { showTooltip, hideTooltip } = useTooltip()
  const { t } = useTranslation()

  const renderTextTooltip = (key: string, yOffset = 60) => (
    <HoverIcon
      className="hover"
      onMouseOver={(e) => {
        const rect = e.currentTarget.getBoundingClientRect()
        showTooltip('text', e, t(`${key}_description`, { defaultValue: '' }), {
          x: rect.left + window.scrollX + rect.width / 2,
          y: rect.top + window.scrollY - yOffset,
        })
      }}
      onMouseLeave={() => hideTooltip()}
    />
  )

  const handleClick = () => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortOrder('desc')
    }
    setPage(1)
  }

  return (
    <th
      className={`${field} ${tooltip ? 'has-tooltip' : ''}`}
      onClick={handleClick}
      style={{ cursor: 'pointer' }}
    >
      <span className="sort-header">
        {label}
        {tooltip && renderTextTooltip(field)}
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
