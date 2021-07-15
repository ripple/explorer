const formatAmount = require('./formatAmount');

const hasRenew = flags => 0x00010000 & flags;
const hasClose = flags => 0x00020000 & flags;

const findNode = (meta, nodeType) => {
  const metaNode = meta.AffectedNodes.find(
    node => node[nodeType] && node[nodeType].LedgerEntryType === 'PayChannel'
  );
  return metaNode ? metaNode[nodeType] : null;
};

const getDetails = node => {
  const st = node.FinalFields.SourceTag ? `:${node.FinalFields.SourceTag}` : '';
  const dt = node.FinalFields.DestinationTag ? `:${node.FinalFields.DestinationTag}` : '';
  return {
    source: `${node.FinalFields.Account}${st}`,
    destination: `${node.FinalFields.Destination}${dt}`,
    channel: node.LedgerIndex,
  };
};

module.exports = (tx, meta) => {
  let node = findNode(meta, 'ModifiedNode');
  const data = {
    channel: tx.Channel,
    total_claimed: tx.Balance ? formatAmount(tx.Balance) : undefined,
    renew: hasRenew(tx.Flags) || undefined,
    close: hasClose(tx.Flags) || undefined,
  };

  if (node) {
    const details = getDetails(node);
    const amount = node.FinalFields.Amount;
    const total = node.FinalFields.Balance;
    const claimed = node.PreviousFields.Balance ? total - node.PreviousFields.Balance : null;
    const remaining = amount - total;

    return Object.assign(data, details, {
      channel_amount: formatAmount(amount),
      claimed: claimed ? formatAmount(claimed) : undefined,
      remaining: formatAmount(remaining),
    });
  }

  node = findNode(meta, 'DeletedNode');
  if (node) {
    const details = getDetails(node);
    const returned = node.FinalFields.Amount - node.FinalFields.Balance;

    return Object.assign(data, details, {
      channel_amount: formatAmount(node.FinalFields.Amount),
      total_claimed: formatAmount(node.FinalFields.Balance),
      returned: returned ? formatAmount(returned) : undefined,
      deleted: true,
    });
  }

  return data;
};
