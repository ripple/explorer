import type { SignerListSet } from 'xrpl'
import { SignerListSetInstructions } from './types'
import { TransactionParser } from '../types'
import { formatSignerList } from '../../../../../rippled/lib/formatSignerList'

export const parser: TransactionParser<
  SignerListSet,
  SignerListSetInstructions
> = (tx) => formatSignerList(tx)
