import { FC } from 'react'
import type { Memo } from 'xrpl/dist/npm/models/common'
import type { TransactionMetadata } from 'xrpl'

export enum TransactionCategory {
  DEX = 'DEX',
  ACCOUNT = 'ACCOUNT',
  PAYMENT = 'PAYMENT',
  NFT = 'NFT',
  XCHAIN = 'XCHAIN',
  MPT = "MPT",
  PSEUDO = 'PSEUDO',
  UNKNOWN = 'UNKNOWN',
}

export enum TransactionAction {
  CREATE = 'CREATE',
  CANCEL = 'CANCEL',
  FINISH = 'FINISH',
  MODIFY = 'MODIFY',
  SEND = 'SEND',
  UNKNOWN = 'UNKNOWN',
}

export interface TransactionTableDetailProps<I = any> {
  instructions: I
}
export type TransactionTableDetailComponent = FC<TransactionTableDetailProps>

export interface TransactionDescriptionProps<T = any, M = TransactionMetadata> {
  data: {
    tx: T
    meta: M
  }
}
export type TransactionDescriptionComponent = FC<TransactionDescriptionProps>

export interface TransactionSimpleProps<I = any> {
  data: {
    instructions: I
  }
}
export type TransactionSimpleComponent = FC<TransactionSimpleProps>
export type TransactionParser<T = any, I = any> = (tx: T, meta: any) => I

export interface TransactionMapping {
  Description?: TransactionDescriptionComponent
  Simple: TransactionSimpleComponent
  TableDetail?: TransactionTableDetailComponent
  parser?: TransactionParser
  action: TransactionAction
  category: TransactionCategory
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
