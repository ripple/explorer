import {
  TransactionAction,
  TransactionCategory,
  TransactionMapping,
} from '../types'

import { Description } from './Description'
import { Simple } from './Simple'
import { TableDetail } from './TableDetail'
import { parser } from './parser'

export const PaymentChannelCreateTransaction: TransactionMapping = {
  Description,
  Simple,
  TableDetail,
  action: TransactionAction.CREATE,
  category: TransactionCategory.PAYMENT,
  parser,
}
