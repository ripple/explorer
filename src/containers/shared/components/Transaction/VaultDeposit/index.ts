import {
  TransactionAction,
  TransactionCategory,
  TransactionMapping,
} from '../types'
import { Description } from './Description'
import { Simple } from './Simple'
import { TableDetail } from './TableDetail'

export const VaultDepositTransaction: TransactionMapping = {
  Description,
  Simple,
  TableDetail,
  action: TransactionAction.SEND,
  category: TransactionCategory.OTHER,
}
