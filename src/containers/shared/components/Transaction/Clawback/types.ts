import { TransactionCommonFields } from '../types'
import { Amount, ExplorerAmount } from '../../../types'

export interface Clawback extends TransactionCommonFields {
  Amount: Amount
  MPTokenHolder?: string
}

export interface ClawbackInstructions {
  account: string
  amount?: ExplorerAmount
  holder?: string
}
