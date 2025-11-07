import {
  TransactionAction,
  TransactionCategory,
  TransactionMapping,
} from '../types'

import { Simple } from './Simple'

export const LoanManageTransaction: TransactionMapping = {
  Simple,
  action: TransactionAction.MODIFY,
  category: TransactionCategory.OTHER,
}
