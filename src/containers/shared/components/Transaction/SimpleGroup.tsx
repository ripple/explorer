export type SimpleGroupProps = React.PropsWithChildren<{
  children: any
  title?: string
}>

export const SimpleGroup = ({ children, title }: SimpleGroupProps) => (
  <div className="group" data-testid="group">
    {title && <div className="group-title">{title}</div>}
    {children}
  </div>
)
