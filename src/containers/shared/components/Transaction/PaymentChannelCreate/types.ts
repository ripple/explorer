import { TransactionCommonFields } from '../types'
import { ExplorerAmount } from '../../../types'

export interface PaymentChannelCreate extends TransactionCommonFields {
  Amount: string
  Destination: string
  SettleDelay: number
  PublicKey: string
  CancelAfter?: number
  DestinationTag?: number
}

export interface PaymentChannelCreateInstructions {
  amount: ExplorerAmount
  source: string
  destination: string
  channel: string
  delay: number
  cancelAfter: string
}
