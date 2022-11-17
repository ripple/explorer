import { TransactionParser } from '../types'

import { DepositPreauth } from './types'

export const parser: TransactionParser<DepositPreauth, DepositPreauth> = (tx) =>
  tx
