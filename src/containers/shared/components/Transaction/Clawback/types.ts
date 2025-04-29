import { ExplorerAmount } from '../../../types'

export interface ClawbackInstructions {
  account: string
  amount?: ExplorerAmount
  holder?: string
}
