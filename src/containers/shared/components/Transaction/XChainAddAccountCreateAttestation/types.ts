import type { Currency } from 'xrpl'
import { ExplorerAmount } from '../../../types'

export interface XChainAddAccountCreateAttestationInstructions {
  lockingDoor: string
  lockingIssue: Currency
  issuingDoor: string
  issuingIssue: Currency
  amount: ExplorerAmount
  otherChainSource: string
  destination: string
}
