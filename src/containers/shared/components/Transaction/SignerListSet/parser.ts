import { SignerListSet, SignerListSetInstructions } from './types'
import { TransactionParser } from '../types'

const utils = require('../../../../../rippled/lib/utils')

export const parser: TransactionParser<
  SignerListSet,
  SignerListSetInstructions
> = (tx) => utils.formatSignerList(tx)
