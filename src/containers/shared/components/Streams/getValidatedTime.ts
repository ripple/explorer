import { convertRippleDate } from '../../../../rippled/lib/convertRippleDate'
import { LedgerValidation } from './types'

// `Metrics.quorum` is typed `string` but is numeric at runtime, so callers
// don't need to coerce it themselves.
export const getValidatedTime = (
  validations: LedgerValidation[],
  unl: string[] | undefined,
  quorum: string | number | undefined,
): number | null => {
  const quorumCount = Number(quorum)
  if (!unl?.length || !quorumCount || Number.isNaN(quorumCount)) {
    return null
  }

  // `validations` is already in arrival order. Filter to UNL members,
  // preserving that order, then take the first `quorum` of those -- not
  // the first `quorum` overall followed by a filter.
  const unlValidationsInArrivalOrder = validations.filter((validation) =>
    unl.includes(validation.validation_public_key),
  )

  if (unlValidationsInArrivalOrder.length < quorumCount) {
    return null
  }

  const firstQuorumValidations = unlValidationsInArrivalOrder.slice(
    0,
    quorumCount,
  )
  const latestSigningTime = Math.max(
    ...firstQuorumValidations.map((validation) => validation.signing_time),
  )

  return convertRippleDate(latestSigningTime)
}
