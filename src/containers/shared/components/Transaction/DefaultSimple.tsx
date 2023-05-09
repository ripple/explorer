import { isValidClassicAddress } from 'ripple-address-codec'
import { Account } from '../Account'
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

const processValue = (value: any) => {
  if (typeof value === 'string') {
    if (isValidClassicAddress(value)) {
      return <Account account={value} />
    }
    return value
  }
  return JSON.stringify(value)
}

const getRow = (key: any, value: any) => {
  if (typeof value === 'object') {
    return (
      <SimpleGroup key={key} title={key} data-test={key}>
        <>
          {Object.entries(value).map(([childKey, childValue]) =>
            getRow(childKey, childValue),
          )}
        </>
      </SimpleGroup>
    )
  }
  return (
    <SimpleRow key={key} label={key} data-test={key}>
      {processValue(value)}
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
