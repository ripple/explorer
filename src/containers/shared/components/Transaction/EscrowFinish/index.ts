import {
  TransactionAction,
  TransactionCategory,
  TransactionMapping,
} from '../types'

import { Simple } from './Simple'
import { Description } from './Description'
import { parser } from './parser'
import { TableDetail } from './TableDetail'

export const EscrowFinishTransaction: TransactionMapping = {
  Description,
  Simple,
  TableDetail,
  action: TransactionAction.FINISH,
  category: TransactionCategory.PAYMENT,
  parser,
}
