import { Amount } from '../../../types'
import { TransactionCommonFields } from '../types'

// TODO: remove when lending protocol (XLS-66) is supported on xrpl.js
export interface LoanBrokerCoverWithdraw extends TransactionCommonFields {
  LoanBrokerID: string
  Amount: Amount
  Destination?: string
}
