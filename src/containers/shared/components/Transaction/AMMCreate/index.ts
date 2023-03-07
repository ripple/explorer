import { Simple } from './Simple'
import {
  TransactionAction,
  TransactionCategory,
  TransactionMapping,
} from '../types'
import { parser } from './parser'

export const AMMCreate: TransactionMapping = {
  Simple,
  action: TransactionAction.CREATE,
  category: TransactionCategory.DEX,
  parser,
}
