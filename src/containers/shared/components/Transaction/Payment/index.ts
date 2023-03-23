import {
  TransactionAction,
  TransactionCategory,
  TransactionMapping,
} from '../types'

import { Simple } from './Simple'
import { Description } from './Description'
import { parser } from './parser'
import { TableDetail } from './TableDetail'

export const PaymentTransaction: TransactionMapping = {
  Description,
  Simple,
  TableDetail,
  action: TransactionAction.SEND,
  category: TransactionCategory.PAYMENT,
  parser,
}
