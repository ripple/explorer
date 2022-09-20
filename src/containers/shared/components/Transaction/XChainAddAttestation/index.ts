import { TransactionMapping } from '../types'

import { Simple } from './Simple'
import { parser } from './parser'

export const XChainAddAttestationTransaction: TransactionMapping = {
  Simple,
  parser,
}
