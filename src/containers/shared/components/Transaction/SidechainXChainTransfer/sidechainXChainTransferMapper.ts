import formatAmount from '../../../../../rippled/lib/txSummary/formatAmount';

export default function sidechainXChainTransferMapper(tx: any) {
  // TODO: update when Sidechain return bug is fixed
  return {
    account: tx.Account,
    sourceDoor: tx.Sidechain?.src_chain_door || 'rFakeAccount',
    sourceIssue: tx.Sidechain?.src_chain_issue || 'fakeXRP',
    destinationDoor: tx.Sidechain?.dst_chain_door || 'rFakeAccount2',
    destinationIssue: tx.Sidechain?.dst_chain_issue || 'fakeXRP2',
    amount: formatAmount(tx.Amount),
    xchainSequence: tx.XChainSequence,
  };
}
