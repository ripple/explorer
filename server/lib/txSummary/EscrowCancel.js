const formatAmount = require('./formatAmount');

const findNode = meta => {
  const node = meta.AffectedNodes.filter(
    a => a.DeletedNode && a.DeletedNode.LedgerEntryType === 'Escrow'
  )[0];

  return node ? node.DeletedNode.FinalFields : {};
};

module.exports = (tx, meta) => {
  const escrow = findNode(meta);

  return {
    sequence: tx.OfferSequence,
    owner: tx.Owner,
    tx: escrow.PreviousTxnID,
    amount: escrow.Amount ? formatAmount(escrow.Amount) : undefined,
    destination:
      escrow.Destination && escrow.Destination !== escrow.Account ? escrow.Destination : undefined,
    condition: escrow.Condition,
  };
};
