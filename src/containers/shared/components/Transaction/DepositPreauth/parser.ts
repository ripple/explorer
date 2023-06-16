import { DepositPreauth } from 'xrpl'
import { TransactionParser } from '../types'

export const parser: TransactionParser<DepositPreauth, DepositPreauth> = (tx) =>
  tx
