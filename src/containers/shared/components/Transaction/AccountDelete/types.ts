import { TransactionCommonFields } from '../types'

export interface AccountDelete extends TransactionCommonFields {
  Destination: string
  DestinationTag?: string
}
