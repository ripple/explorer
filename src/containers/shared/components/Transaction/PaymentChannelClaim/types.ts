import { TransactionCommonFields } from '../types'
import { ExplorerAmount } from '../../../types'

export interface PaymentChannelClaim extends TransactionCommonFields {
  Channel: string
  Balance: string
  Amount: string
}

export interface PaymentChannelClaimInstructions {
  channelAmount?: ExplorerAmount
  claimed?: ExplorerAmount
  remaining?: ExplorerAmount
  totalClaimed?: ExplorerAmount
  source?: string
  destination?: string
  channel?: string
  renew?: boolean
  close?: boolean
  deleted?: boolean
}
