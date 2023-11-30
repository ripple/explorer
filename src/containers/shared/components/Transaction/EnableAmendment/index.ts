import {
  TransactionAction,
  TransactionCategory,
  TransactionMapping,
} from '../types'

import { Simple } from './Simple'

export const EnableAmendmentTransaction: TransactionMapping = {
  Simple,
  action: TransactionAction.MODIFY,
  category: TransactionCategory.PSEUDO,
}
