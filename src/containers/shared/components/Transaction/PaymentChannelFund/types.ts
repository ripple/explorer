import { ExplorerAmount } from '../../../types'
import { TransactionCommonFields } from '../types'

export interface PaymentChannelFund extends TransactionCommonFields {
  Channel: string
  Balance: string
  Amount: string
}

export interface PaymentChannelFundInstructions {
  channelAmount?: ExplorerAmount
  increase?: ExplorerAmount
  totalClaimed?: ExplorerAmount
  source?: string
  destination?: string
  channel?: string
}
