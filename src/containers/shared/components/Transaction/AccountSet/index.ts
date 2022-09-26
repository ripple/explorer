import { TransactionMapping } from '../types'
import { parser } from './parser'
import { Simple } from './Simple'

export const AccountSetTransaction: TransactionMapping = {
  Simple,
  TransactionCategory: 'Account',
  parser,
}
