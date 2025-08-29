import type { AccountDelete } from 'xrpl'
import {
  TransactionAction,
  TransactionCategory,
  TransactionMapping,
} from '../types'

import { Simple } from './Simple'

// Extend the AccountDelete type to include CredentialIDs
interface AccountDeleteWithCredentials extends AccountDelete {
  CredentialIDs?: string[]
}

export const AccountDeleteTransaction: TransactionMapping = {
  Simple,
  action: TransactionAction.CANCEL,
  category: TransactionCategory.ACCOUNT,
  parser: (tx: AccountDeleteWithCredentials): AccountDeleteWithCredentials =>
    tx,
}
