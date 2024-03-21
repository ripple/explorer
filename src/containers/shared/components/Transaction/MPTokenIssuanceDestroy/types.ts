import { TransactionCommonFields } from '../types'

export interface MPTokenIssuanceDestroy extends TransactionCommonFields {
  MPTokenIssuanceID: string
}

export interface MPTokenIssuanceDestroyInstructions {
  issuanceID: string
}
