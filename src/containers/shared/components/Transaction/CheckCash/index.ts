import { TransactionMapping } from '../types'
import { parser } from './parser'
import { Simple } from './Simple'

export const CheckCashTransaction: TransactionMapping = {
  Simple,
  TransactionCategory: 'Payment',
  parser,
}
