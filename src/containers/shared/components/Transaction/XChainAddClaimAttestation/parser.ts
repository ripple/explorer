import type { XChainAddClaimAttestation } from 'xrpl'
import { formatAmount } from '../../../../../rippled/lib/txSummary/formatAmount'
import { TransactionParser } from '../types'
import { XChainAddClaimAttestationInstructions } from './types'

export const parser: TransactionParser<
  XChainAddClaimAttestation,
  XChainAddClaimAttestationInstructions
> = (tx) =>
  // TODO: get bridge owner somehow
  // it's not necessarily in the metadata
  ({
    lockingDoor: tx.XChainBridge.LockingChainDoor,
    lockingIssue: tx.XChainBridge.LockingChainIssue,
    issuingDoor: tx.XChainBridge.IssuingChainDoor,
    issuingIssue: tx.XChainBridge.IssuingChainIssue,
    amount: formatAmount(tx.Amount),
    otherChainSource: tx.OtherChainSource,
    destination: tx.Destination,
    claimId: tx.XChainClaimID,
  })
