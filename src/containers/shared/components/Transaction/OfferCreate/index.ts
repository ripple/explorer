import { TransactionMapping } from '../types';

import { Simple } from './Simple';
import { Description } from './Description';
import { parser } from './parser';
import { TableDetail } from './TableDetail';

export const OfferCreateTransaction: TransactionMapping = {
  Description,
  Simple,
  TableDetail,
  parser,
};
