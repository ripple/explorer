import {
  TransactionAction,
  TransactionCategory,
  TransactionMapping,
} from '../types'

import { Simple } from './Simple'
import { parser } from './parser'

export const SetHookTransaction: TransactionMapping = {
  Simple,
  action: TransactionAction.CREATE,
  category: TransactionCategory.ACCOUNT,
  parser,
}
