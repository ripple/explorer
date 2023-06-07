import { transactionTypes } from './Transaction'

interface Props {
  instructions: any
  type: string
}

export function TxDetails({ type = '', instructions }: Props) {
  // Locate the component for detail row that is unique per TransactionType.
  const TableDetail = transactionTypes[type]?.TableDetail
  if (TableDetail) {
    return <TableDetail instructions={instructions} />
  }

  return null
}
