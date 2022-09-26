import { TransactionMapping } from '../types'
import { parser } from './parser'
import { Simple } from './Simple'

export const OfferCancelTransaction: TransactionMapping = {
  Simple,
  TransactionCategory: 'Dex',
  parser,
}
