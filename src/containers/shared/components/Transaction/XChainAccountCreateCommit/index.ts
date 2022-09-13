import { TransactionMapping } from '../types'

import { Simple } from './Simple'
import { parser } from './parser'

export const XChainAccountCreateCommitTransaction: TransactionMapping = {
  Simple,
  parser,
}
