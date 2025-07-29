import { Amount } from '../../../types'
import { TransactionCommonFields } from '../types'

// TODO: clean up when xrpl.js released with this feature.
export interface VaultDeposit extends TransactionCommonFields {
  VaultID: string
  Amount: Amount
}
