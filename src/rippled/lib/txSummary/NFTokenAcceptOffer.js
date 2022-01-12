const formatAmount = require('./formatAmount');

module.exports = (tx, meta) => {
  const acceptedOfferNode = meta.AffectedNodes.find(
    node => node.DeletedNode?.LedgerEntryType === 'NFTokenOffer'
  ).DeletedNode.FinalFields;

  const amount = formatAmount(acceptedOfferNode.Amount);
  const tokenID = acceptedOfferNode.TokenID;
  const offerer = acceptedOfferNode.Owner;
  const accepter = tx.Account;
  const isSellOffer = (acceptedOfferNode.Flags & 1) !== 0;
  const seller = isSellOffer ? offerer : accepter;
  const buyer = isSellOffer ? accepter : offerer;

  const acceptedOfferIDs = [tx.BuyOffer, tx.SellOffer].filter(offer => offer);

  return {
    amount,
    tokenID,
    seller,
    buyer,
    acceptedOfferIDs,
  };
};
