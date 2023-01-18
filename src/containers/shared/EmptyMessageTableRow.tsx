import * as React from 'react'

export type EmptyMessageTableRowProps = React.PropsWithChildren<{
  colSpan: number // How many columns is the table
}>

export const EmptyMessageTableRow = ({
  children,
  colSpan,
}: EmptyMessageTableRowProps) => (
  <tr>
    <td colSpan={colSpan} className="empty-message">
      {children}
    </td>
  </tr>
)
