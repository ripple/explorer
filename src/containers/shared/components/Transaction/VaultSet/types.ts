import { TransactionCommonFields } from '../types'

// TODO: clean up when xrpl.js released with this feature.
export interface VaultSet extends TransactionCommonFields {
  VaultID: string
  Data?: string
  AssetsMaximum?: string
  DomainID?: string
}
