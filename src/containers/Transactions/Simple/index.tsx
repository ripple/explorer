import { FC } from 'react'
import { transactionTypes } from '../../shared/components/Transaction'
import { DefaultSimple } from '../../shared/components/Transaction/DefaultSimple'

export const Simple: FC<{
  data: any
  type: string
}> = ({ data, type }) => {
  // Locate the component for the left side of the simple tab that is unique per TransactionType.
  const SimpleComponent = transactionTypes[type]?.Simple
  if (SimpleComponent) {
    return <SimpleComponent data={data} />
  }
  return <DefaultSimple data={data} />
}
