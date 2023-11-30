import { ExplorerAmount } from '../../../types'

export interface PaymentInstructions {
  partial: boolean
  amount: ExplorerAmount
  max?: ExplorerAmount
  convert?: ExplorerAmount
  destination: string
  sourceTag?: number
}
