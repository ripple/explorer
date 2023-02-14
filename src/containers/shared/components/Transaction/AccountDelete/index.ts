import {
  TransactionAction,
  TransactionCategory,
  TransactionMapping,
} from '../types'

import { Simple } from './Simple'
import { AccountDelete } from './types'

export const AccountDeleteTransaction: TransactionMapping = {
  Simple,
  action: TransactionAction.CANCEL,
  category: TransactionCategory.ACCOUNT,
  parser: (tx: AccountDelete): AccountDelete => tx,
}
