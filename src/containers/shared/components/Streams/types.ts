import type { ValidationStream } from 'xrpl'
import { TransactionSummary } from '../../types'

export type LedgerValidation = ValidationStream & { partial?: boolean }

export interface LedgerHash {
  hash: string
  validated: boolean
  unselected: boolean
  validations: LedgerValidation[]
  time: number
  cookie?: string
}

export interface Ledger {
  transactions: TransactionSummary[]
  index: number
  hashes: LedgerHash[]
  seen: number
  txCount?: number
  closeTime: number
  totalFees: number
}

export interface Metrics {
  load_fee?: string
  txn_sec?: string
  txn_ledger?: string
  ledger_interval?: string
  avg_fee?: string
  quorum?: string
  nUnl?: string[]
  base_fee?: string
}
