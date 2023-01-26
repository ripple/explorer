import { Simple } from './Simple'
import {
  TransactionAction,
  TransactionCategory,
  TransactionMapping,
} from '../types'
import { parser } from './parser'

export const AMMBid: TransactionMapping = {
  Simple,
  action: TransactionAction.MODIFY,
  parser,
  category: TransactionCategory.DEX,
}
