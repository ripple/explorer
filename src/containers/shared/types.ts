import type { TransactionMetadata } from 'xrpl'
import type { Memo } from 'xrpl/dist/npm/models/common'

export interface IssuedCurrency {
  currency: string
  issuer: string
}

export interface XRP {
  currency: 'XRP'
}

export type Currency = IssuedCurrency | XRP

export interface IssuedCurrencyAmount extends IssuedCurrency {
  value: string
}

export type Amount = IssuedCurrencyAmount | string

export type ExplorerAmount = {
  issuer?: string
  currency: string
  amount: number
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

export interface AccountNFToken {
  Flags: number
  Issuer: string
  NFTokenID: string
  NFTokenTaxon: number
  URI?: string
  // eslint-disable-next-line camelcase
  nft_serial: number
}
