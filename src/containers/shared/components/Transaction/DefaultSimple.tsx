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
  'EmitDetails',
  'Fee',
  'FirstLedgerSequence',
  'Flags',
  'HookParameters',
  'LastLedgerSequence',
  'Memos',
  'Signers',
  'NetworkID',
  'Sequence',
  'SigningPubKey',
  'TransactionType',
  'TxnSignature',
  'ctid',
  'date',
  'warnings',
]

// Currency objects have at most 2 keys: `currency` and optionally `issuer`
const MAX_CURRENCY_OBJECT_KEYS = 2
// Amount objects have exactly 3 keys: `currency`, `issuer`, and `value`
const AMOUNT_OBJECT_KEY_COUNT = 3

const displayKey = (key: string) => key.replace(/([a-z])([A-Z])/g, '$1 $2')

const isMPTAsset = (value: any) =>
  typeof value === 'object' &&
  typeof value.mpt_issuance_id === 'string' &&
  !value.value

const isMPTAmount = (value: any) =>
  typeof value === 'object' &&
  typeof value.mpt_issuance_id === 'string' &&
  typeof value.value === 'string'

const isCurrency = (value: any) =>
  isMPTAsset(value) ||
  (typeof value === 'object' &&
    Object.keys(value).length <= MAX_CURRENCY_OBJECT_KEYS &&
    (value.issuer == null || typeof value.issuer === 'string') &&
    typeof value.currency === 'string')

const isAmount = (amount: any, key: any = null) =>
  key === 'Amount' ||
  isMPTAmount(amount) ||
  (typeof amount === 'object' &&
    Object.keys(amount).length === AMOUNT_OBJECT_KEY_COUNT &&
    typeof amount.issuer === 'string' &&
    typeof amount.currency === 'string' &&
    typeof amount.value === 'string')

const processValue = (value: any) => {
  if (typeof value === 'string') {
    if (isValidClassicAddress(value)) {
      return <Account account={value} />
    }
    if (value.length > 300) {
      return `${value.substring(0, 300)}...`
    }
    if (value === '') {
      return <em>{'<empty>'}</em>
    }
    if (typeof value === 'object') {
      return JSON.stringify(value)
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
        const processed = processValue(childValue[childKey])
        return <div key={JSON.stringify(childValue)}>{processed}</div>
      }
      const processed = processValue(childValue)
      return <div key={JSON.stringify(processed)}>{processed}</div>
    })
  }

  if (typeof value === 'object') {
    return (
      <div className="subgroup">
        {Object.entries(value).map(([childKey, childValue]) => (
          <div key={childKey} data-testid={childKey}>
            {`${childKey}: `}
            {processValue(childValue)}
          </div>
        ))}
      </div>
    )
  }

  return JSON.stringify(value)
}

const getRowNested = (key: any, value: any, uniqueKey: string = '') => {
  if (key === 'Amount') {
    return (
      <SimpleRow
        key={`${key}${uniqueKey}`}
        label={displayKey(key)}
        data-testid={key}
      >
        <Amount value={formatAmount(value)} />
      </SimpleRow>
    )
  }

  if (isCurrency(value)) {
    return (
      <SimpleRow
        key={`${key}${uniqueKey}`}
        label={displayKey(key)}
        data-testid={key}
      >
        <Currency
          currency={value.mpt_issuance_id || value.currency}
          issuer={value.issuer}
          isMPT={!!value.mpt_issuance_id}
        />
      </SimpleRow>
    )
  }

  if (isAmount(value, key)) {
    return (
      <SimpleRow
        key={`${key}${uniqueKey}`}
        label={displayKey(key)}
        data-testid={key}
      >
        <Amount value={formatAmount(value)} />
      </SimpleRow>
    )
  }
  return (
    <SimpleRow
      key={`${key}${uniqueKey}`}
      label={displayKey(key)}
      data-testid={key}
    >
      {processValue(value)}
    </SimpleRow>
  )
}

const getRow = (key: any, value: any) => {
  if (Array.isArray(value)) {
    return (
      <div key={key}>
        {value.map((innerValue, index) => {
          if (
            typeof innerValue === 'object' &&
            Object.keys(innerValue).length === 1
          ) {
            const innerKey = Object.keys(innerValue)[0]
            return (
              <SimpleGroup
                // eslint-disable-next-line react/no-array-index-key -- okay here
                key={`group_${innerKey}_${index}`}
                title={displayKey(innerKey)}
                data-testid={key}
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
      </div>
    )
  }

  if (
    typeof value === 'object' &&
    !isCurrency(value) &&
    !isAmount(value, key)
  ) {
    return (
      <SimpleGroup key={key} title={displayKey(key)} data-testid={key}>
        {Object.entries(value).map(([childKey, childValue], index) =>
          getRowNested(childKey, childValue, index.toString()),
        )}
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

  return (
    <>{Object.entries(uniqueData).map(([key, value]) => getRow(key, value))}</>
  )
}
