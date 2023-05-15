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
  'warnings',
]

const processValue = (value: any) => {
  if (typeof value === 'string') {
    if (isValidClassicAddress(value)) {
      return <Account account={value} />
    }
    if (value.length > 300) {
      return `${value.substring(0, 300)}...`
    }
    return value
  }

  if (Array.isArray(value)) {
    return value.map((childValue) => {
      if (
        typeof childValue === 'object' &&
        Object.keys(childValue).length === 1
      ) {
        const childKey = Object.keys(childValue)[0]
        return <div key={childValue}>{processValue(childValue[childKey])}</div>
      }
      return <div key={childValue}>{processValue(childValue)}</div>
    })
  }

  if (typeof value === 'object') {
    return (
      <div className="subgroup">
        {Object.entries(value).map(([childKey, childValue]) => (
          <div key={childKey}>{`${childKey}: ${processValue(childValue)}`}</div>
        ))}
      </div>
    )
  }

  return JSON.stringify(value)
}

const getRowNested = (key: any, value: any, uniqueKey: string = '') => {
  console.log(key, value, uniqueKey)

  if (key === 'Amount') {
    return (
      <SimpleRow key={`${key}${uniqueKey}`} label={key} data-test={key}>
        <Amount value={formatAmount(value)} />
      </SimpleRow>
    )
  }

  return (
    <SimpleRow key={`${key}${uniqueKey}`} label={key} data-test={key}>
      {processValue(value)}
    </SimpleRow>
  )
}

const getRow = (key: any, value: any) => {
  if (Array.isArray(value)) {
    return (
      <>
        {value.map((innerValue, index) => {
          if (
            typeof innerValue === 'object' &&
            Object.keys(innerValue).length === 1
          ) {
            const innerKey = Object.keys(innerValue)[0]
            return (
              <SimpleGroup
                // eslint-disable-next-line react/no-array-index-key
                key={`group_${innerKey}_${index}`}
                title={innerKey}
                data-test={key}
              >
                {Object.entries(innerValue[innerKey]).map(
                  ([childKey, childValue], index2) =>
                    getRowNested(childKey, childValue, index2.toString()),
                )}
              </SimpleGroup>
            )
          }
          return getRowNested(index.toString(), innerValue, index.toString())
        })}
      </>
    )
  }

  if (typeof value === 'object') {
    return (
      <SimpleGroup key={key} title={key} data-test={key}>
        <>
          {Object.entries(value).map(([childKey, childValue]) =>
            getRowNested(childKey, childValue),
          )}
        </>
      </SimpleGroup>
    )
  }

  return getRowNested(key, value)
}

export const DefaultSimple = ({ data }: TransactionSimpleProps) => {
  const uniqueData = Object.fromEntries(
    Object.entries(data.instructions).filter(
      ([key, value]) => !DEFAULT_TX_ELEMENTS.includes(key) && value != null,
    ),
  )

  console.log(uniqueData)

  return (
    <>{Object.entries(uniqueData).map(([key, value]) => getRow(key, value))}</>
  )
}
