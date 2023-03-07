import {
  TransactionAction,
  TransactionCategory,
  TransactionMapping,
} from '../types'

import { Simple } from './Simple'
import { parser } from './parser'
import { TableDetail } from './TableDetail'

export const TicketCreateTransaction: TransactionMapping = {
  Simple,
  TableDetail,
  action: TransactionAction.CREATE,
  category: TransactionCategory.ACCOUNT,
  parser,
}
