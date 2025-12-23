import { TransactionCommonFields } from '../types'

// TODO: remove when lending protocol (XLS-66) is supported on xrpl.js
export interface LoanBrokerDelete extends TransactionCommonFields {
  LoanBrokerID: string
}
