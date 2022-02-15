const formatAmount = require('./formatAmount');

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
  const node = findNode(meta, 'ModifiedNode');
  const channel = node ? getDetails(node) : {};
  channel.increase = formatAmount(tx.Amount);

  if (node) {
    channel.channel_amount = formatAmount(node.FinalFields.Amount);
    channel.total_claimed = formatAmount(node.FinalFields.Balance);
  }

  return channel;
};
