import {
  TransactionAction,
  TransactionCategory,
  TransactionMapping,
} from '../types'
import { Simple } from './Simple'
import { parser } from './parser'

export const CheckCashTransaction: TransactionMapping = {
  Simple,
  action: TransactionAction.FINISH,
  category: TransactionCategory.PAYMENT,
  parser,
}
