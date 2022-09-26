import { TransactionMapping } from '../types'
import { parser } from './parser'
import { Simple } from './Simple'

export const EscrowCancelTransaction: TransactionMapping = {
  Simple,
  TransactionCategory: 'Payment',
  parser,
}
