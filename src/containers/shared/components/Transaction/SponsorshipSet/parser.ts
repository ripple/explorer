import { formatAmount } from '../../../../../rippled/lib/txSummary/formatAmount'
import { SponsorshipSet } from './types'

const TF_DELETE_OBJECT = 0x00100000
const TF_SET_REQUIRE_SIGN_FOR_FEE = 0x00010000
const TF_CLEAR_REQUIRE_SIGN_FOR_FEE = 0x00020000
const TF_SET_REQUIRE_SIGN_FOR_RESERVE = 0x00040000
const TF_CLEAR_REQUIRE_SIGN_FOR_RESERVE = 0x00080000

export function parser(tx: SponsorshipSet) {
  const flags = tx.Flags || 0
  // If CounterpartySponsor is given, this account is the sponsee; if Sponsee
  // is given, this account is the sponsor.
  const sponsor = tx.CounterpartySponsor ?? tx.Account
  const sponsee = tx.Sponsee ?? tx.Account

  return {
    sponsor,
    sponsee,
    isDelete: Boolean(flags & TF_DELETE_OBJECT),
    feeAmount:
      tx.FeeAmount !== undefined ? formatAmount(tx.FeeAmount) : undefined,
    maxFee: tx.MaxFee !== undefined ? formatAmount(tx.MaxFee) : undefined,
    reserveCount: tx.ReserveCount,
    requireSignForFee:
      Boolean(flags & TF_SET_REQUIRE_SIGN_FOR_FEE) || undefined,
    clearRequireSignForFee:
      Boolean(flags & TF_CLEAR_REQUIRE_SIGN_FOR_FEE) || undefined,
    requireSignForReserve:
      Boolean(flags & TF_SET_REQUIRE_SIGN_FOR_RESERVE) || undefined,
    clearRequireSignForReserve:
      Boolean(flags & TF_CLEAR_REQUIRE_SIGN_FOR_RESERVE) || undefined,
  }
}
