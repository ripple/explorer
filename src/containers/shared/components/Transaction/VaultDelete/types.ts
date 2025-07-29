import { TransactionCommonFields } from '../types'

// TODO: clean up when xrpl.js released with this feature.
export interface VaultDelete extends TransactionCommonFields {
  VaultID: string
}
