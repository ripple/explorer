export interface TokenTableRowProps {
  label: string
  value: any
}

export const TokenTableRow = (props: TokenTableRowProps) => {
  const { label, value } = props
  return (
    <tr className="row">
      <td className="col1">{label}</td>
      <td className="col2">{value}</td>
    </tr>
  )
}
