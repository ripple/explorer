import { PropsWithChildren } from 'react'
import classnames from 'classnames'

export type SimpleRowProps = PropsWithChildren<{
  className?: string
  label: string
  'data-testid'?: string
}>

export const SimpleRow = (props: SimpleRowProps) => {
  const { label, children, className, 'data-testid': testId } = props
  return (
    <div className="row" data-testid={testId ?? label}>
      <div className="label">{label}</div>
      <div className={classnames(`value`, className)}>{children}</div>
    </div>
  )
}
