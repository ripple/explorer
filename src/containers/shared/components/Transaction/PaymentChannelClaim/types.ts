import { ExplorerAmount } from '../../../types'

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
