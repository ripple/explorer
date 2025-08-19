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

export interface RunningMetrics {
  txn_sec?: string
  txn_ledger?: string
  ledger_interval?: string
  avg_fee?: string
}

export interface Metrics extends RunningMetrics {
  base_fee?: string
  load_fee?: string
  nUnl?: string[]
  quorum?: string
}
