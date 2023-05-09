import { Simple } from './Simple'
import {
  TransactionMapping,
  TransactionAction,
  TransactionCategory,
} from '../types'
import { parser } from './parser'

export const DefaultTx: TransactionMapping = {
  Simple,
  parser,
  action: TransactionAction.UNKNOWN,
  category: TransactionCategory.UNKNOWN,
}
