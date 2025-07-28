import { TransactionCommonFields } from '../types'

// TODO: clean up when xrpl.js released with this feature.
export interface VaultCreate extends TransactionCommonFields {
  Asset: { currency: string; issuer: string }
  AssetsMaximum?: string
  Data?: string
  MPTokenMetadata?: string
  WithdrawalPolicy?: number
  DomainID?: string
}
