const formatAmount = require('./formatAmount');
const formatFailedPartialAmount = require('./formatFailedPartialAmount');

const isPartialPayment = flags => 0x00020000 & flags;

module.exports = (tx, meta) => {
  const max = tx.SendMax ? formatAmount(tx.SendMax) : undefined;
  const partial = !!isPartialPayment(tx.Flags);
  const failedPartial = partial && meta.TransactionResult !== 'tesSUCCESS';
  const amount = failedPartial
    ? formatFailedPartialAmount(tx.Amount)
    : formatAmount(partial ? meta.delivered_amount : tx.Amount);
  const dt = tx.DestinationTag !== undefined ? `:${tx.DestinationTag}` : '';

  if (tx.Account === tx.Destination) {
    return {
      amount,
      convert: max,
      partial,
    };
  }

  return {
    amount,
    max,
    destination: `${tx.Destination}${dt}`,
    sourceTag: tx.SourceTag,
    partial,
  };
};
