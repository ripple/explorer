import { TransactionMapping } from 'containers/shared/components/Transaction/types'

import { Simple } from './Simple'
import { Description } from './Description'
import { parser } from './parser'
import { TableDetail } from './TableDetail'

export const AMMDeposit: TransactionMapping = {
  Description,
  Simple,
  TableDetail,
  parser,
}
