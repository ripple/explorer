import {
  TransactionAction,
  TransactionCategory,
  TransactionMapping,
} from '../types'

import { Simple } from './Simple'
import { TableDetail } from './TableDetail'

export const PermissionedDomainDeleteTransaction: TransactionMapping = {
  Simple,
  TableDetail,
  action: TransactionAction.CANCEL,
  category: TransactionCategory.ACCOUNT,
}
