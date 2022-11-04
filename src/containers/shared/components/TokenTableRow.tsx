import React from 'react'

export interface TokenTableRowProps {
  shouldDisplay?: boolean
  label: string
  value: any
}

export const TokenTableRow = (props: TokenTableRowProps) => {
  const { shouldDisplay = true, label, value } = props
  return (
    <>
      {shouldDisplay && (
        <tr className="row">
          <td className="col1">{label}</td>
          <td className="col2">{value}</td>
        </tr>
      )}
    </>
  )
}
