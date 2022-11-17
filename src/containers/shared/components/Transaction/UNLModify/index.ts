import { TransactionMapping } from '../types'

import { Simple } from './Simple'
import { UNLModify } from './types'

export const UNLModifyTransaction: TransactionMapping = {
  Simple,
  parser: (tx: UNLModify): UNLModify => tx,
}
