import { TransactionMapping } from '../types'

import { Simple } from './Simple'
import { Description } from './Description'
import { parser } from './parser'

export const DepositPreauthTransaction: TransactionMapping = {
  Description,
  Simple,
  parser,
}
