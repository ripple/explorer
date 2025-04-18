import {
  TransactionAction,
  TransactionCategory,
  TransactionMapping,
} from '../types'

import { Simple } from './Simple'
import { Description } from './Description'

export const DepositPreauthTransaction: TransactionMapping = {
  Description,
  Simple,
  action: TransactionAction.MODIFY,
  category: TransactionCategory.ACCOUNT,
}
