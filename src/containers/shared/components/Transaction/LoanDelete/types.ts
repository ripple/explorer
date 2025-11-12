import { TransactionCommonFields } from '../types'

// TODO: remove when lending protocol (XLS-66) is supported on xrpl.js
export interface LoanDelete extends TransactionCommonFields {
  LoanID: string
}
