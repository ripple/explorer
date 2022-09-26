import { TransactionMapping } from '../types'
import { parser } from './parser'
import { Simple } from './Simple'

export const TrustSetTransaction: TransactionMapping = {
  Simple,
  TransactionCategory: 'Account',
  parser,
}
