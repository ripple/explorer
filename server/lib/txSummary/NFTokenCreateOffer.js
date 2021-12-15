const formatAmount = require('./formatAmount');

module.exports = (tx, meta) => {
  const account = tx.Account;
  const amount = formatAmount(tx.Amount);
  const tokenID = tx.TokenID;
  const isSellOffer = tx.Flags & (1 !== 0);
  const owner = tx.Owner;

  return {
    account,
    amount,
    tokenID,
    isSellOffer,
    owner,
  };
};
