import {
  TransactionAction,
  TransactionCategory,
  TransactionMapping,
} from '../types'

import { Simple } from './Simple'
import { TableDetail } from './TableDetail'
import { parser } from './parser'

export const LoanSetTransaction: TransactionMapping = {
  Simple,
  TableDetail,
  parser,
  action: TransactionAction.MODIFY,
  category: TransactionCategory.OTHER,
}
