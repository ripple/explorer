import { TransactionMapping } from 'containers/shared/components/Transaction/types'

import { Simple } from './Simple'
import { Description } from './Description'
import { parser } from './parser'
import { TableDetail } from './TableDetail'

export const AMMBid: TransactionMapping = {
  Description,
  Simple,
  TableDetail,
  parser,
}
