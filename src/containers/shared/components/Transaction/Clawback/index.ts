import {
  TransactionAction,
  TransactionCategory,
  TransactionMapping,
} from '../types'

import { Simple } from './Simple'
import { parser } from './parser'
import { TableDetail } from './TableDetail'
import { Description } from './Description'

export const ClawbackTransaction: TransactionMapping = {
  Simple,
  TableDetail,
  Description,
  action: TransactionAction.CANCEL,
  category: TransactionCategory.PAYMENT,
  parser,
}
