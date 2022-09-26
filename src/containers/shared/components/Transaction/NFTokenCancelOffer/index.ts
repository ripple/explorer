import { TransactionMapping } from '../types'
import { parser } from './parser'
import { Simple } from './Simple'

export const NFTokenCancelOfferTransaction: TransactionMapping = {
  Simple,
  TransactionCategory: 'Nft',
  parser,
}
