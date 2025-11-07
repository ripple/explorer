import {
  TransactionAction,
  TransactionCategory,
  TransactionMapping,
} from '../types'

import { Simple } from './Simple'

export const LoanPayTransaction: TransactionMapping = {
  Simple,
  action: TransactionAction.SEND,
  category: TransactionCategory.OTHER,
}
