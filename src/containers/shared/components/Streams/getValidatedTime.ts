import { convertRippleDate } from '../../../../rippled/lib/convertRippleDate'
import { ValidatorResponse } from '../../vhsTypes'
import { LedgerValidation } from './types'

// `Metrics.quorum` is typed `string` but is numeric at runtime, so callers
// don't need to coerce it themselves.
export const getValidatedTime = (
  validations: LedgerValidation[],
  unl: string[] | undefined,
  quorum: string | number | undefined,
  validators?: Record<string, ValidatorResponse>,
  nUnl?: string[],
): number | null => {
  const quorumCount = Number(quorum)
  if (!unl?.length || !quorumCount || Number.isNaN(quorumCount)) {
    return null
  }

  // `nUnl` holds master keys; `validation_public_key` is a signing key, so
  // the lookup goes through the validator's own master_key.
  const isNegativeUnl = (publicKey: string): boolean => {
    const masterKey = validators?.[publicKey]?.master_key
    return Boolean(masterKey && nUnl?.includes(masterKey))
  }

  // `validations` is already in arrival order. Filter to full validations
  // from UNL members that aren't in the negative UNL, preserving that
  // order and counting each validator once (a validator running two
  // servers on one key can otherwise double-count), then take the first
  // `quorum` of those -- not the first `quorum` overall followed by a
  // filter.
  const seenKeys = new Set<string>()
  const unlValidationsInArrivalOrder = validations.filter((validation) => {
    const publicKey = validation.validation_public_key
    if (
      validation.full === false ||
      !unl.includes(publicKey) ||
      seenKeys.has(publicKey) ||
      isNegativeUnl(publicKey)
    ) {
      return false
    }
    seenKeys.add(publicKey)
    return true
  })

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
