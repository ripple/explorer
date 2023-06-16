import type { NFTokenBurn } from 'xrpl'
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
  parser: (tx: NFTokenBurn) => tx,
}
