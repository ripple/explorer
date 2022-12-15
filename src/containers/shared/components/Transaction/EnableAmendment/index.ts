import {
  TransactionAction,
  TransactionCategory,
  TransactionMapping,
} from '../types'

import { Simple } from './Simple'
import { EnableAmendment } from './types'

export const EnableAmendmentTransaction: TransactionMapping = {
  Simple,
  parser: (tx: EnableAmendment): EnableAmendment => tx,
  action: TransactionAction.MODIFY,
  category: TransactionCategory.PSEUDO,
}
