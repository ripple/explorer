import type { UNLModify } from 'xrpl'
import {
  TransactionAction,
  TransactionCategory,
  TransactionMapping,
} from '../types'

import { Simple } from './Simple'

export const UNLModifyTransaction: TransactionMapping = {
  Simple,
  action: TransactionAction.MODIFY,
  category: TransactionCategory.PSEUDO,
  parser: (tx: UNLModify): UNLModify => tx,
}
