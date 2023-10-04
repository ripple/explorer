import {
  TransactionAction,
  TransactionCategory,
  TransactionMapping,
} from '../types'

import { Simple } from './Simple'
import { TableDetail } from './TableDetail'

export const DIDSetTransaction: TransactionMapping = {
  Simple,
  TableDetail,
  action: TransactionAction.CREATE,
  category: TransactionCategory.ACCOUNT,
}
