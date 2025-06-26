import { TransactionSummary } from '../shared/types'

export interface Hash {
  hash: string
  // eslint-disable-next-line camelcase -- TODO: change
  trusted_count: number
  validations: any[] // TODO: type properly
  unselected: boolean
  validated: boolean
}

export interface Ledger {
  // eslint-disable-next-line camelcase -- mimicking rippled
  close_time: string
  hashes: Hash[]
  // eslint-disable-next-line camelcase -- mimicking rippled
  ledger_hash: string
  // eslint-disable-next-line camelcase -- mimicking rippled
  ledger_index: number
  // eslint-disable-next-line camelcase -- mimicking rippled
  parent_hash: string
  seen: number
  // eslint-disable-next-line camelcase -- mimicking rippled
  total_fees: number
  // eslint-disable-next-line camelcase -- mimicking rippled
  total_xrp: number
  transactions: TransactionSummary[]
  // eslint-disable-next-line camelcase -- TODO: change
  txn_count: number
}

export interface ValidatorResponse {
  // eslint-disable-next-line camelcase -- from VHS
  signing_key: string
  // eslint-disable-next-line camelcase -- from VHS
  master_key: string
  unl: string
  domain: string | null
}
