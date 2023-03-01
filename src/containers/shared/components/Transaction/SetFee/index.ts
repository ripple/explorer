import {
  TransactionAction,
  TransactionCategory,
  TransactionMapping,
} from '../types'

import { Simple } from './Simple'
import { parser } from './parser'
import { Description } from './Description'

export const SetFeeTransaction: TransactionMapping = {
  Description,
  Simple,
  action: TransactionAction.MODIFY,
  category: TransactionCategory.ACCOUNT,
  parser,
}
