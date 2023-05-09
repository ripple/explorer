import { SimpleGroup } from './SimpleGroup'
import { SimpleRow } from './SimpleRow'
import { TransactionSimpleProps } from './types'

const DEFAULT_TX_ELEMENTS = [
  'Account',
  'Fee',
  'Flags',
  'LastLedgerSequence',
  'NetworkID',
  'Sequence',
  'SigningPubKey',
  'TransactionType',
  'TxnSignature',
  'ctid',
  'date',
]

const getRow = (key: any, value: any) => {
  if (typeof value === 'object') {
    return (
      <SimpleGroup key={key} label={key} data-test={key}>
        <>
          {Object.entries(value).map(([childKey, childValue]) =>
            getRow(childKey, childValue),
          )}
        </>
      </SimpleGroup>
    )
  }

  const valueToRender =
    typeof value === 'string' ? value : JSON.stringify(value)
  return (
    <SimpleRow key={key} label={key} data-test={key}>
      {valueToRender}
    </SimpleRow>
  )
}

export const DefaultSimple = ({ data }: TransactionSimpleProps) => {
  const uniqueData = Object.fromEntries(
    Object.entries(data.instructions).filter(
      ([key, value]) => !DEFAULT_TX_ELEMENTS.includes(key) && value != null,
    ),
  )

  return (
    <>{Object.entries(uniqueData).map(([key, value]) => getRow(key, value))}</>
  )
}
