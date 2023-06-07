export type SimpleGroupProps = React.PropsWithChildren<{
  children: any
  title?: string
}>

export function SimpleGroup({ children, title }: SimpleGroupProps) {
  return (
    <div className="group" data-test="group">
      {title && <div className="group-title">{title}</div>}
      {children}
    </div>
  )
}
