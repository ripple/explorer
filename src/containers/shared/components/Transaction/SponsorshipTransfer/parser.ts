import { SponsorshipTransfer } from './types'

const TF_END = 0x00000001
const TF_CREATE = 0x00000002
const TF_REASSIGN = 0x00000004

export type SponsorshipTransferOperation = 'create' | 'reassign' | 'end'

function getOperation(flags: number): SponsorshipTransferOperation | undefined {
  if (flags & TF_CREATE) return 'create'
  if (flags & TF_REASSIGN) return 'reassign'
  if (flags & TF_END) return 'end'
  return undefined
}

export function parser(tx: SponsorshipTransfer) {
  return {
    operation: getOperation(tx.Flags || 0),
    account: tx.Account,
    objectId: tx.ObjectID,
    sponsor: tx.Sponsor,
    sponsee: tx.Sponsee,
  }
}
