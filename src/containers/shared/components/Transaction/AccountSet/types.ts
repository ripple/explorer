import { TransactionCommonFields } from '../types'

export interface AccountSet extends TransactionCommonFields {
  ClearFlag?: number
  Domain?: string
  EmailHash?: string
  MessageKey?: string
  NFTokenMinter?: string
  SetFlag?: number
  TickSize?: number
  TransferRate?: number
}
