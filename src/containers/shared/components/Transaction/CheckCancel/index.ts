import {
  TransactionAction,
  TransactionCategory,
  TransactionMapping,
} from '../types'
import { Simple } from './Simple'

export const CheckCancelTransaction: TransactionMapping = {
  Simple,
  action: TransactionAction.CANCEL,
  category: TransactionCategory.PAYMENT,
}
