import {
  TransactionAction,
  TransactionCategory,
  TransactionMapping,
} from '../types'

import { Simple } from './Simple'
import { TableDetail } from './TableDetail'
import { Description } from './Description'
import { parser } from './parser'

export const BatchTransaction: TransactionMapping = {
  Simple,
  Description,
  TableDetail,
  action: TransactionAction.CREATE,
  category: TransactionCategory.OTHER,
  parser,
}
