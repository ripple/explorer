import { TransactionMapping } from '../types';

import { OfferCreateSimple } from './OfferCreateSimple';
import { OfferCreateDescription } from './OfferCreateDescription';
import { offerCreateMapper } from './offerCreateMapper';
import { OfferCreateTableDetail } from './OfferCreateTableDetail';

export const OfferCreateTransaction: TransactionMapping = {
  Description: OfferCreateDescription,
  Simple: OfferCreateSimple,
  TableDetail: OfferCreateTableDetail,
  mapper: offerCreateMapper,
};
