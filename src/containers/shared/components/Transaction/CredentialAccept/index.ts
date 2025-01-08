import {
  TransactionAction,
  TransactionCategory,
  TransactionMapping,
} from '../types'

import { Simple } from './Simple'
import { TableDetail } from './TableDetail'

export const CredentialAcceptTransaction: TransactionMapping = {
  Simple,
  TableDetail,
  action: TransactionAction.ACCEPT,
  category: TransactionCategory.ACCOUNT,
}
