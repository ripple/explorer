import { Amount } from '../../../types'
import { TransactionCommonFields } from '../types'

// TODO: remove when lending protocol (XLS-66) is supported on xrpl.js
export interface LoanBrokerSet extends TransactionCommonFields {
  VaultID: string
  LoanBrokerID?: string
  Data?: string
  ManagementFeeRate?: number
  DebtMaximum?: Amount
  CoverRateMinimum?: number
  CoverRateLiquidation?: number
}
