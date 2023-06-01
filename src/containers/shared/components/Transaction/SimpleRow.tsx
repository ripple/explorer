import { PropsWithChildren } from 'react'
import classnames from 'classnames'

export type SimpleRowProps = PropsWithChildren<{
  className?: string
  label: string
}>

export const SimpleRow = (props: SimpleRowProps) => {
  const { label, children, className } = props
  return (
    <div className="row">
      <div className="label">{label}</div>
      <div className={classnames(`value`, className)}>{children}</div>
    </div>
  )
}
