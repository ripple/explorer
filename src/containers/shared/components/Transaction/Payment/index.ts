import { TransactionMapping } from '../types'
import { parser } from './parser'
import { Simple } from './Simple'

export const PaymentTransaction: TransactionMapping = {
  Simple,
  TransactionCategory: 'Payment',
  parser,
}
