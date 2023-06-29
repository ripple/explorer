import {
  TransactionAction,
  TransactionCategory,
  TransactionMapping,
} from '../types'

import { Simple } from './Simple'
import { parser } from './parser'

export const ClawbackTransaction: TransactionMapping = {
  Simple,
  action: TransactionAction.CANCEL,
  category: TransactionCategory.PAYMENT,
  parser,
}
