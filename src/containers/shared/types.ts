import type { TransactionMetadata } from 'xrpl'
import type { Memo } from 'xrpl/dist/npm/models/common'

export interface IssuedCurrency {
  currency: string
  issuer: string
}

export interface XRP {
  currency: 'XRP'
  issuer: never
}

export type Currency = IssuedCurrency | XRP

export interface IssuedCurrencyAmount extends IssuedCurrency {
  value: string
}

export interface MPTAmount {
  mpt_issuance_id: string
  value: string
}

export type Amount = IssuedCurrencyAmount | MPTAmount | string

export type ExplorerAmount = {
  issuer?: string
  currency: string
  amount: number | string
  isMPT?: boolean
}

export interface Tx {
  Memos?: Memo[]
  TransactionType: string
  Flags?: number
}

export interface Transaction {
  meta: TransactionMetadata
  tx: Tx
}

// A summary of a Transaction created by summarizeTransaction
export interface TransactionSummary {
  hash: string
  ctid: string
  type: string
  result: string
  account: string
}

export interface AccountNFToken {
  Flags: number
  Issuer: string
  NFTokenID: string
  NFTokenTaxon: number
  URI?: string
  // eslint-disable-next-line camelcase
  nft_serial: number
}
