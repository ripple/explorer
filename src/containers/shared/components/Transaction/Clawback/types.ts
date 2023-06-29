import { TransactionCommonFields } from '../types'
import { Amount } from '../../../types'

export interface Clawback extends TransactionCommonFields {
  Amount: Amount
}

export interface ClawbackInstructions {
  account: string
  amount: { currency: string; amount: number; issuer?: string }
  holder?: string
}
