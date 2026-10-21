import {
  TransactionAction,
  TransactionCategory,
  TransactionMapping,
} from '../types'
import { Simple } from './Simple'
import { TableDetail } from './TableDetail'
import { parser } from './parser'

export const CheckCashTransaction: TransactionMapping = {
  Simple,
  TableDetail,
  action: TransactionAction.FINISH,
  category: TransactionCategory.PAYMENT,
  parser,
}
