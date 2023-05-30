import { PropsWithChildren } from 'react'
import clsx from 'clsx'

export type SubheaderLineProps = PropsWithChildren<{
  className?: string
  label: string
}>

export const SubheaderLine = (props: SubheaderLineProps) => {
  const { label, children, className } = props
  return (
    <li>
      <span className="label">{label}</span>
      <div className={clsx(`value`, className)}>{children}</div>
    </li>
  )
}
