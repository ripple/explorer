import { PropsWithChildren } from 'react'

export type EmptyMessageTableRowProps = PropsWithChildren<{
  colSpan: number // How many columns is the table
}>

export function EmptyMessageTableRow({
  children,
  colSpan,
}: EmptyMessageTableRowProps) {
  return (
    <tr>
      <td colSpan={colSpan} className="empty-message">
        {children}
      </td>
    </tr>
  )
}
