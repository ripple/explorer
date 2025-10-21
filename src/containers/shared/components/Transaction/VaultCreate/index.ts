import {
  TransactionAction,
  TransactionCategory,
  TransactionMapping,
} from '../types'
import { Description } from './Description'
import { Simple } from './Simple'
import { TableDetail } from './TableDetail'

export const VaultCreateTransaction: TransactionMapping = {
  Description,
  Simple,
  TableDetail,
  action: TransactionAction.CREATE,
  category: TransactionCategory.OTHER,
}
