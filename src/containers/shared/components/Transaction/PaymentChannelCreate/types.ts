import { ExplorerAmount } from '../../../types'

export interface PaymentChannelCreateInstructions {
  amount: ExplorerAmount
  source: string
  destination: string
  channel: string
  delay: number
  cancelAfter: string
}
