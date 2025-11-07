import {
  TransactionAction,
  TransactionCategory,
  TransactionMapping,
} from '../types'

import { Simple } from './Simple'

export const LoanSetTransaction: TransactionMapping = {
  Simple,
  action: TransactionAction.MODIFY,
  category: TransactionCategory.OTHER,
}
