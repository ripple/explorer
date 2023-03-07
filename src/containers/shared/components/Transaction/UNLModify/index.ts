import {
  TransactionAction,
  TransactionCategory,
  TransactionMapping,
} from '../types'

import { Simple } from './Simple'
import { UNLModify } from './types'

export const UNLModifyTransaction: TransactionMapping = {
  Simple,
  action: TransactionAction.MODIFY,
  category: TransactionCategory.PSEUDO,
  parser: (tx: UNLModify): UNLModify => tx,
}
