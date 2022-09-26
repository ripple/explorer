import { TransactionMapping } from '../types'
import { parser } from './parser'
import { Simple } from './Simple'

export const TicketCreateTransaction: TransactionMapping = {
  Simple,
  TransactionCategory: 'Account',
  parser,
}
