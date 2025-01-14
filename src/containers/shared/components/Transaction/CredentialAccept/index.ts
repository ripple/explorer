import {
  TransactionAction,
  TransactionCategory,
  TransactionMapping,
} from '../types'

import { Simple } from './Simple'

export const CredentialAcceptTransaction: TransactionMapping = {
  Simple,
  action: TransactionAction.ACCEPT,
  category: TransactionCategory.ACCOUNT,
}
