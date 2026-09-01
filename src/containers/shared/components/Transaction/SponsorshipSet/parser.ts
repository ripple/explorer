import type { SponsorshipSet } from 'xrpl'
import { formatAmount } from '../../../../../rippled/lib/txSummary/formatAmount'

const TF_DELETE_OBJECT = 0x00100000
const TF_SET_REQUIRE_SIGN_FOR_FEE = 0x00010000
const TF_SET_REQUIRE_SIGN_FOR_RESERVE = 0x00040000

// Signs the formatted delta amount explicitly, since a negative amount
// (a withdrawal) would otherwise read identically to a positive one at a
// glance in the UI.
function getSignedDelta(delta: string | undefined) {
  if (delta === undefined) return undefined
  const formatted = formatAmount(delta)
  const amount = Number(formatted.amount)
  return {
    value: { ...formatted, amount: Math.abs(amount) },
    modifier: amount < 0 ? ('-' as const) : ('+' as const),
  }
}

export function parser(tx: SponsorshipSet) {
  const flags = typeof tx.Flags === 'number' ? tx.Flags : 0
  // If CounterpartySponsor is given, this account is the sponsee; if Sponsee
  // is given, this account is the sponsor.
  const sponsor = tx.CounterpartySponsor ?? tx.Account
  const sponsee = tx.Sponsee ?? tx.Account

  return {
    sponsor,
    sponsee,
    isDelete: Boolean(flags & TF_DELETE_OBJECT),
    feeAmountDelta: getSignedDelta(tx.FeeAmountDelta),
    maxFee: tx.MaxFee !== undefined ? formatAmount(tx.MaxFee) : undefined,
    remainingOwnerCountDelta: tx.RemainingOwnerCountDelta,
    requireSignForFee:
      Boolean(flags & TF_SET_REQUIRE_SIGN_FOR_FEE) || undefined,
    requireSignForReserve:
      Boolean(flags & TF_SET_REQUIRE_SIGN_FOR_RESERVE) || undefined,
  }
}
