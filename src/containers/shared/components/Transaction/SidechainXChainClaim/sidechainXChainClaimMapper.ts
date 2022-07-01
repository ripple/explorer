export default function sidechainXChainClaimMapper(tx: any) {
  // TODO: update when Sidechain return bug is fixed
  return {
    account: tx.Account || 'rFakeAccount',
    sourceDoor: tx.Sidechain?.src_chain_door || 'rFakeAccount',
    sourceIssue: tx.Sidechain?.src_chain_issue || 'fakeXRP',
    destinationDoor: tx.Sidechain?.dst_chain_door || 'rFakeAccount2',
    destinationIssue: tx.Sidechain?.dst_chain_issue || 'fakeXRP2',
  };
}
