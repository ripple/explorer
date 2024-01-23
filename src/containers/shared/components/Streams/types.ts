import { ValidationStream } from 'xrpl'

export interface LedgerHash {
  hash: string
  validated: boolean
  validations: ValidationStream[]
  time: number
  cookie?: string
}

export interface Ledger {
  transactions: any[]
  index: number
  hashes: LedgerHash[]
  seen: number
  txCount?: number
  closeTime: number
  totalFees: number
}

export interface Metrics {
  load_fee: string
  txn_sec: string
  txn_ledger: string
  ledger_interval: string
  avg_fee: string
  quorum: string
  nUnl: string[]
  base_fee?: string
}
