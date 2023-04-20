import classnames from 'classnames'
import { useCallback, useEffect, useRef, useState } from 'react'
import ArrowIcon from '../../images/down_arrow.svg'
import './dropdown.scss'

export interface DropdownProps {
  title: string | JSX.Element
  children: any
  className?: string
}

// TODO: Add useId after upgrading to react@18 to populate id on .dropdown-menu and aria-controlled by on .dropdown-toggle
/**
 * A simple dropdown that has auto closing
 *
 * @param title The value in the toggle
 * @param children The contents of the menu. DropdownItem is the preferred child component
 * @param className
 * @constructor
 *
 * @example
 * <Dropdown title="Choose Something">
 *   <DropdownItem handler={() => alert('hello')}>Option 1</DropdownItem>
 *   <DropdownItem>Option 2</DropdownItem>
 * </Dropdown>
 */
export const Dropdown = ({ title, children, className }: DropdownProps) => {
  const [expanded, setExpanded] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const globalClickListener = useCallback((nativeEvent) => {
    // ignore click event happened inside the dropdown menu
    if (dropdownRef.current && dropdownRef.current.contains(nativeEvent.target))
      return
    // else hide dropdown menu
    setExpanded(false)
    document.removeEventListener('click', globalClickListener)
  }, [])

  useEffect(
    (): (() => void) => () =>
      // remove listener when cleaning up component
      document.removeEventListener('click', globalClickListener),
    [globalClickListener],
  )

  const toggleExpand = () => {
    // don't de-expand if clicking in the textbox
    setExpanded((prevExpanded) => !prevExpanded)
    document.addEventListener('click', globalClickListener)
  }

  return (
    <div
      className={classnames(
        'dropdown',
        expanded && 'dropdown-expanded',
        className,
      )}
      ref={dropdownRef}
    >
      <button
        className="btn dropdown-toggle"
        type="button"
        onClick={toggleExpand}
        onKeyUp={toggleExpand}
        tabIndex={0}
        aria-haspopup="true"
        aria-expanded={expanded}
      >
        {title} <ArrowIcon className="arrow" />
      </button>
      <div
        className="dropdown-menu"
        role="menu"
        tabIndex={0}
        aria-hidden={!expanded}
      >
        {children}
      </div>
    </div>
  )
}
