import { TransactionMapping } from '../types'
import { Simple } from './Simple'
import { parser } from './parser'

export const NFTokenAcceptOfferTransaction: TransactionMapping = {
  Simple,
  TransactionCategory: 'Nft',
  parser,
}
