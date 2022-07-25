import { OfferCreateTransaction as OfferCreate } from './OfferCreate';
import { TransactionMapping } from './types';

export const transactionTypes: { [key: string]: TransactionMapping } = {
  OfferCreate,
};
