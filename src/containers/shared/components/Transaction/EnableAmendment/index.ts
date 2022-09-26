import { TransactionMapping } from '../types'
import { parser } from './parser'
import { Simple } from './Simple'

export const EnableAmendmentTransaction: TransactionMapping = {
  Simple,
  TransactionCategory: 'Pseudo',
  parser,
}
