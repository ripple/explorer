import { TransactionMapping } from '../types'

import { Simple } from './Simple'
import { parser } from './parser'

export const XChainClaimTransaction: TransactionMapping = {
  Simple,
  TransactionCategory: 'XChain',
  parser,
}
