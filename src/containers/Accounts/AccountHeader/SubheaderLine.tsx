import { PropsWithChildren } from 'react'
import classnames from 'classnames'

export type SubheaderLineProps = PropsWithChildren<{
  className?: string
  label: string
}>

export const SubheaderLine = (props: SubheaderLineProps) => {
  const { label, children, className } = props
  return (
    <li>
      <span className="label">{label}</span>
      <div className={classnames(`value`, className)}>{children}</div>
    </li>
  )
}
