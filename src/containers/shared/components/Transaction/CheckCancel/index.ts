import { TransactionMapping } from '../types'
import { parser } from './parser'
import { Simple } from './Simple'

export const CheckCancelTransaction: TransactionMapping = {
  Simple,
  TransactionCategory: 'Payment',
  parser,
}
