import { TransactionMapping } from '../types'
import { parser } from './parser'
import { Simple } from './Simple'

export const CheckCreateTransaction: TransactionMapping = {
  Simple,
  TransactionCategory: 'Payment',
  parser,
}
