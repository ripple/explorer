import type { AccountDelete } from 'xrpl'
import {
  TransactionAction,
  TransactionCategory,
  TransactionMapping,
} from '../types'

import { Simple } from './Simple'

export const AccountDeleteTransaction: TransactionMapping = {
  Simple,
  action: TransactionAction.CANCEL,
  category: TransactionCategory.ACCOUNT,
  parser: (tx: AccountDelete): AccountDelete => tx,
}
