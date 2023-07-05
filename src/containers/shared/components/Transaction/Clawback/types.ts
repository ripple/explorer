import { TransactionCommonFields } from '../types'
import { Amount, ExplorerAmount } from '../../../types'

export interface Clawback extends TransactionCommonFields {
  Amount: Amount
}

export interface ClawbackInstructions {
  account: string
  amount?: ExplorerAmount
  holder?: string
}
