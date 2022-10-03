import { Amount, ExplorerAmount } from '../../../types'
import { TransactionCommonFields } from '../types'

export interface Payment extends TransactionCommonFields {
  Amount: Amount
  DeliverMin?: Amount // TODO: Display this value somewhere
  Destination: string
  DestinationTag?: number
  InvoiceId?: string // TODO: Display this value somewhere
  SendMax?: Amount
}

export interface PaymentInstructions {
  partial: boolean
  amount: ExplorerAmount
  max?: ExplorerAmount
  convert?: ExplorerAmount
  destination: string
  sourceTag?: number
}
