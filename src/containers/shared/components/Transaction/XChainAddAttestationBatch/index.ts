import { TransactionMapping } from '../types'

import { Simple } from './Simple'
import { parser } from './parser'

export const XChainAddAttestationBatchTransaction: TransactionMapping = {
  Simple,
  parser,
}
