import { CURRENCY_ORDER } from '../../../transactionUtils';
import formatAmount from '../../../../../rippled/lib/txSummary/formatAmount';

export function parser(tx: any) {
  const gets = formatAmount(tx.TakerGets);
  const base = tx.TakerGets.currency || 'XRP';
  const counter = tx.TakerPays.currency || 'XRP';
  const pays = formatAmount(tx.TakerPays);
  const price = pays.amount / gets.amount;
  const invert = CURRENCY_ORDER.indexOf(counter) > CURRENCY_ORDER.indexOf(base);

  return {
    gets,
    pays,
    price: (invert ? 1 / price : price).toPrecision(6),
    pair: invert ? `${counter}/${base}` : `${base}/${counter}`,
    cancel: tx.OfferSequence,
  };
}
