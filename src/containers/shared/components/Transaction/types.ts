import React from 'react'
import { Memo } from '../../transactionUtils'

export interface Instructions {
  owner: string
  sequence: number
  ticketSequence: number
  fulfillment: string
  finishAfter: string
  cancelAfter: string
  condition: string
  quorum: number
  max: {
    amount: number
    currency: string
    issuer: string
  }
  maxSigners: number
  signers: any[]
  domain: string
  key: string
  limit: any
  pair: string
  sourceTag: number
  source: string
  claimed: any
  // eslint-disable-next-line camelcase
  channel_amount: number
  remaining: number
  renew: boolean
  close: boolean
  deleted: boolean
  gets: any
  pays: any
  price: string
  cancel: number
  convert: any
  amount: any
  destination: string
  partial: boolean
  ticketCount: number
}

export interface TransactionTableDetailProps<I = any> {
  instructions: I
}
export type TransactionTableDetailComponent =
  React.FC<TransactionTableDetailProps>

export interface TransactionDescriptionProps<T = any, M = any> {
  data: {
    tx: T
    meta: M
  }
}
export type TransactionDescriptionComponent =
  React.FC<TransactionDescriptionProps>

export interface TransactionSimpleProps<I = any> {
  data: {
    instructions: I
  }
}
export type TransactionSimpleComponent = React.FC<TransactionSimpleProps>
export type TransactionParser<T = any, I = any> = (tx: T, meta: any) => I

export interface TransactionMapping {
  Description?: TransactionDescriptionComponent
  Simple: TransactionSimpleComponent
  TableDetail?: TransactionTableDetailComponent
  parser: TransactionParser
}

export interface TransactionCommonFields {
  date: string
  Account: string
  TransactionType: string
  Fee: string
  Sequence: number
  AccountTxnID?: string
  Flags?: number
  LastLedgerSequence?: number
  Memos?: Memo[]
  Signers?: object[]
  SourceTag?: number
  SignerPubKey?: string
  TicketSequence?: number
  TxnSignature?: string
}
