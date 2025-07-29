import { TransactionCommonFields } from '../types'

// TODO: clean up when xrpl.js released with this feature.
export interface VaultClawback extends TransactionCommonFields {
  VaultID: string
  Holder: string
  Amount?:
    | {
        currency: string
        issuer: string
        value: string
      }
    | {
        mpt_issuance_id: string
        value: string
      }
}
