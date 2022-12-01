import { TransactionMapping } from '../types'

import { Simple } from './Simple'
import { parser } from './parser'
import { TableDetail } from './TableDetail'
import { Description } from './Description'

export const PaymentChannelClaimTransaction: TransactionMapping = {
  Description,
  Simple,
  TableDetail,
  parser,
}
