import {
  TransactionAction,
  TransactionCategory,
  TransactionMapping,
} from '../types'

import { Simple } from './Simple'

export const NFTokenBurnTransaction: TransactionMapping = {
  Simple,
  action: TransactionAction.CANCEL,
  category: TransactionCategory.NFT,
}
