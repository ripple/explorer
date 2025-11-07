import {
  TransactionAction,
  TransactionCategory,
  TransactionMapping,
} from '../types'

import { Simple } from './Simple'

export const LoanBrokerSetTransaction: TransactionMapping = {
  Simple,
  action: TransactionAction.MODIFY,
  category: TransactionCategory.OTHER,
}
