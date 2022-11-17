import { ExplorerAmount, IssuedCurrencyAmount } from '../../../types'
import { TransactionCommonFields } from '../types'

export interface TrustSet extends TransactionCommonFields {
  LimitAmount: IssuedCurrencyAmount
}

export interface TrustSetInstructions {
  limit: ExplorerAmount
}
