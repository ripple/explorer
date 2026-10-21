import {
  TransactionAction,
  TransactionCategory,
  TransactionMapping,
} from '../types'
import { Simple } from './Simple'
import { parser } from './parser'

export const CheckCreateTransaction: TransactionMapping = {
  Simple,
  action: TransactionAction.CREATE,
  category: TransactionCategory.PAYMENT,
  parser,
}
