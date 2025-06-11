import { PropsWithChildren } from 'react'

export type EmptyMessageTableRowProps = PropsWithChildren<{
  colSpan: number // How many columns is the table
}>

export const EmptyMessageTableRow = ({
  children,
  colSpan,
}: EmptyMessageTableRowProps) => (
  <tr>
    <td colSpan={colSpan} data-testid="empty-message" className="empty-message">
      {children}
    </td>
  </tr>
)
