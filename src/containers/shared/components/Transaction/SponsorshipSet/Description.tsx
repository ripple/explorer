import { Trans } from 'react-i18next'
import type { SponsorshipSet } from 'xrpl'
import { TransactionDescriptionProps } from '../types'
import { Account } from '../../Account'
import { parser } from './parser'

// A negative delta takes budget back from the sponsee, so it reads as a
// reduction rather than as new sponsorship being granted.
function getDescriptionKey(
  isDelete: boolean,
  isDeleteBySponsee: boolean,
  hasFeeDelta: boolean,
  feeIsDecrease: boolean,
  hasReserveDelta: boolean,
  reserveIsDecrease: boolean,
) {
  if (isDelete) {
    return isDeleteBySponsee
      ? 'sponsorship_set_delete_by_sponsee'
      : 'sponsorship_set_delete'
  }
  if (hasFeeDelta && hasReserveDelta) {
    if (feeIsDecrease && reserveIsDecrease)
      return 'sponsorship_set_description_fee_reserve_decrease'
    if (!feeIsDecrease && !reserveIsDecrease)
      return 'sponsorship_set_description_fee_reserve'
    // Mixed signs (one granted, one reduced) don't fit either wording.
    return 'sponsorship_set_description_generic'
  }
  if (hasReserveDelta) {
    return reserveIsDecrease
      ? 'sponsorship_set_description_reserve_decrease'
      : 'sponsorship_set_description_reserve'
  }
  if (hasFeeDelta) {
    return feeIsDecrease
      ? 'sponsorship_set_description_fee_decrease'
      : 'sponsorship_set_description_fee'
  }
  return 'sponsorship_set_description_generic'
}

export const Description = ({
  data,
}: TransactionDescriptionProps<SponsorshipSet>) => {
  const {
    sponsor,
    sponsee,
    isDelete,
    isDeleteBySponsee,
    feeAmountDelta,
    remainingOwnerCountDelta,
  } = parser(data.tx)

  return (
    <Trans
      i18nKey={getDescriptionKey(
        isDelete,
        isDeleteBySponsee,
        Boolean(feeAmountDelta),
        feeAmountDelta?.modifier === '-',
        remainingOwnerCountDelta !== undefined,
        (remainingOwnerCountDelta ?? 0) < 0,
      )}
      components={{
        Sponsor: <Account account={sponsor} />,
        Sponsee: <Account account={sponsee} />,
      }}
    />
  )
}
