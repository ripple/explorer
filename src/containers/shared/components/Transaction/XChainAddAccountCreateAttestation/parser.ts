import { formatAmount } from '../../../../../rippled/lib/txSummary/formatAmount'
import { TransactionParser } from '../types'
import {
  XChainAddAccountCreateAttestation,
  XChainAddAccountCreateAttestationInstructions,
} from './types'

export const parser: TransactionParser<
  XChainAddAccountCreateAttestation,
  XChainAddAccountCreateAttestationInstructions
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
  })
