import { useState } from 'react'
import ReactJson from 'react18-json-view'
import { useTranslation } from 'react-i18next'

import './json-view.scss'
import CollapseAllIcon from '../../images/collapse_all.svg'
import ExpandAllIcon from '../../images/expand_all.svg'

interface JsonViewProps {
  data: any
  showExpandButton?: boolean
  showBackground?: boolean
  // Strings longer than this are collapsed/truncated in the tree. Pass a large
  // value (e.g. Number.MAX_SAFE_INTEGER) to render long strings (URIs, etc.) in full.
  collapseStringsAfterLength?: number
}

export const JsonView = ({
  data,
  showExpandButton = false,
  showBackground = false,
  collapseStringsAfterLength = 65,
}: JsonViewProps) => {
  const { t } = useTranslation()
  const [isExpanded, setIsExpanded] = useState(false)

  const handleExpandToggle = () => {
    setIsExpanded(!isExpanded)
  }

  const Icon = isExpanded ? CollapseAllIcon : ExpandAllIcon

  return (
    <div
      className={`json-view-container ${showBackground ? 'show-background' : ''}`}
    >
      {showExpandButton && (
        <div className="json-view-controls">
          <button
            type="button"
            className="json-view-expand-button"
            onClick={handleExpandToggle}
            aria-label={isExpanded ? t('collapse') : t('expand')}
          >
            <Icon width={24} height={24} />
            {isExpanded ? t('collapse') : t('expand')}
          </button>
        </div>
      )}
      <ReactJson
        src={data}
        collapsed={isExpanded ? false : 5}
        collapseStringsAfterLength={collapseStringsAfterLength}
        customizeNode={(params) => {
          if (params.node === undefined)
            return { className: 'json-view--undefined' }
          return undefined
        }}
      />
    </div>
  )
}
