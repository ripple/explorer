import { useState, ReactNode } from 'react'
import ArrowIcon from '../../images/down_arrow.svg'
import './styles.scss'

interface CollapsibleSectionProps {
  title: ReactNode
  ariaLabel: string
  children: ReactNode
  defaultOpen?: boolean
  className?: string
  keepMounted?: boolean
}

export const CollapsibleSection = ({
  title,
  ariaLabel,
  children,
  defaultOpen = true,
  className,
  keepMounted = false,
}: CollapsibleSectionProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  const classes = ['collapsible-section', className].filter(Boolean).join(' ')

  return (
    <div className={classes}>
      <div className="collapsible-section-header">
        <h3 className="collapsible-section-title">{title}</h3>
        <button
          type="button"
          className="collapsible-section-toggle"
          onClick={() => setIsOpen((s) => !s)}
          aria-expanded={isOpen}
          aria-label={ariaLabel}
        >
          <ArrowIcon
            className={`collapsible-section-arrow ${isOpen ? 'open' : ''}`}
          />
        </button>
      </div>
      {keepMounted ? (
        <div
          className="collapsible-section-body"
          style={{ display: isOpen ? 'block' : 'none' }}
        >
          {children}
        </div>
      ) : (
        isOpen && <div className="collapsible-section-body">{children}</div>
      )}
    </div>
  )
}

export default CollapsibleSection
