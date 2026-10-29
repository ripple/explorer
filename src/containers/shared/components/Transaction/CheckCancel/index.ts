import {
  TransactionAction,
  TransactionCategory,
  TransactionMapping,
} from '../types'
import { Simple } from './Simple'
import { TableDetail } from './TableDetail'
import { parser } from './parser'

export const CheckCancelTransaction: TransactionMapping = {
  Simple,
  TableDetail,
  action: TransactionAction.CANCEL,
  category: TransactionCategory.PAYMENT,
  parser,
}
