import { isValidClassicAddress } from 'ripple-address-codec'
import { formatAmount } from '../../../../rippled/lib/txSummary/formatAmount'
import { Account } from '../Account'
import { Amount } from '../Amount'
import Currency from '../Currency'
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

const processValue = (key: any, value: any) => {
  if (typeof value === 'string') {
    if (isValidClassicAddress(value)) {
      return <Account account={value} />
    }
    return value
  }

  if (
    typeof value === 'object' &&
    Object.keys(value).length <= 2 &&
    (value.issuer == null || typeof value.issuer === 'string') &&
    typeof value.currency === 'string'
  ) {
    return <Currency currency={value.currency} issuer={value.issuer} />
  }

  if (
    typeof value === 'object' &&
    Object.keys(value).length === 3 &&
    typeof value.value === 'string' &&
    typeof value.issuer === 'string' &&
    typeof value.currency === 'string'
  ) {
    return <Amount value={formatAmount(value)} />
  }

  if (key === 'Amount') {
    if (typeof value === 'string') {
      return <Amount value={value} />
    }
    return <Amount value={formatAmount(value)} />
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
      {processValue(key, value)}
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
