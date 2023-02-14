import { Simple } from './Simple'
import {
  TransactionAction,
  TransactionCategory,
  TransactionMapping,
} from '../types'
import { parser } from './parser'

export const AMMDeposit: TransactionMapping = {
  Simple,
  action: TransactionAction.SEND,
  category: TransactionCategory.DEX,
  parser,
}
