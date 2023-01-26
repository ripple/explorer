import { Simple } from './Simple'
import {
  TransactionAction,
  TransactionCategory,
  TransactionMapping,
} from '../types'
import { parser } from './parser'

export const AMMWithdraw: TransactionMapping = {
  Simple,
  action: TransactionAction.SEND,
  parser,
  category: TransactionCategory.DEX,
}
