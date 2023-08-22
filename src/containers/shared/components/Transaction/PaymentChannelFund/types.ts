import { ExplorerAmount } from '../../../types'

export interface PaymentChannelFundInstructions {
  channelAmount?: ExplorerAmount
  increase?: ExplorerAmount
  totalClaimed?: ExplorerAmount
  source?: string
  destination?: string
  channel?: string
}
