import { PropsWithChildren } from 'react'
import clsx from 'clsx'

export type SimpleRowProps = PropsWithChildren<{
  className?: string
  label: string
}>

export const SimpleRow = (props: SimpleRowProps) => {
  const { label, children, className } = props
  return (
    <div className="row">
      <div className="label">{label}</div>
      <div className={clsx(`value`, className)}>{children}</div>
    </div>
  )
}
