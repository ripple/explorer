import {
  TransactionAction,
  TransactionCategory,
  TransactionMapping,
} from '../types'
import { Simple } from './Simple'
import { TableDetail } from './TableDetail'
import { parser } from './parser'

export const CheckCreateTransaction: TransactionMapping = {
  Simple,
  TableDetail,
  action: TransactionAction.CREATE,
  category: TransactionCategory.PAYMENT,
  parser,
}
