import {
  TransactionAction,
  TransactionCategory,
  TransactionMapping,
} from '../types'

import { Simple } from './Simple'
import { AccountDelete } from './types'

export const AccountDeleteTransaction: TransactionMapping = {
  Simple,
  parser: (tx: AccountDelete): AccountDelete => tx,
  action: TransactionAction.CANCEL,
  category: TransactionCategory.ACCOUNT,
}
