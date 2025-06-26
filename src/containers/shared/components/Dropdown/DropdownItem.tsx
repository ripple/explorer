import { PropsWithChildren } from 'react'
import classnames from 'classnames'

export type DropdownItemProps = PropsWithChildren<{
  className?: string
  handler?: (event) => void
  href?: string
}>

export const DropdownItem = ({
  children,
  className,
  handler,
  href,
}: DropdownItemProps) => {
  const Tag = handler || href ? `a` : `div`

  return (
    <Tag
      className={classnames(`dropdown-item`, className)}
      data-testid={`dropdown-item-${className}`}
      role="menuitem"
      onClick={handler}
      onKeyUp={handler}
      tabIndex={0}
      href={href}
    >
      {children}
    </Tag>
  )
}
