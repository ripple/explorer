import { TransactionMapping } from '../types'

import { Simple } from './Simple'
import { parser } from './parser'

export const XChainCommitTransaction: TransactionMapping = {
  Simple,
  parser,
}
