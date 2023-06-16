import type { TicketCreate } from 'xrpl'
import {
  TransactionAction,
  TransactionCategory,
  TransactionMapping,
} from '../types'

import { Simple } from './Simple'
import { TableDetail } from './TableDetail'

export const TicketCreateTransaction: TransactionMapping = {
  Simple,
  TableDetail,
  action: TransactionAction.CREATE,
  category: TransactionCategory.ACCOUNT,
  parser: (tx: TicketCreate) => tx,
}
