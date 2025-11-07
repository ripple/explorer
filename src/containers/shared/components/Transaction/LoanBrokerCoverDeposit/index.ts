import {
  TransactionAction,
  TransactionCategory,
  TransactionMapping,
} from '../types'

import { Simple } from './Simple'

export const LoanBrokerCoverDepositTransaction: TransactionMapping = {
  Simple,
  action: TransactionAction.SEND,
  category: TransactionCategory.OTHER,
}
