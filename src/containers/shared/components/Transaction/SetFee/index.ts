import { TransactionMapping } from '../types'
import { parser } from './parser'
import { Simple } from './Simple'

export const SetFeeTransaction: TransactionMapping = {
  Simple,
  TransactionCategory: 'Pseudo',
  parser,
}
