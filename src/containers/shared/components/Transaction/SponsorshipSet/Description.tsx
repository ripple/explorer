import { Trans } from 'react-i18next'
import { TransactionDescriptionProps } from '../types'
import { Account } from '../../Account'
import { SponsorshipSet } from './types'
import { parser } from './parser'

function getDescriptionKey(
  isDelete: boolean,
  hasFeeDelta: boolean,
  hasReserveDelta: boolean,
) {
  if (isDelete) return 'sponsorship_set_delete'
  if (hasFeeDelta && hasReserveDelta)
    return 'sponsorship_set_description_fee_reserve'
  if (hasReserveDelta) return 'sponsorship_set_description_reserve'
  if (hasFeeDelta) return 'sponsorship_set_description_fee'
  return 'sponsorship_set_description_generic'
}

export const Description = ({
  data,
}: TransactionDescriptionProps<SponsorshipSet>) => {
  const {
    sponsor,
    sponsee,
    isDelete,
    feeAmountDelta,
    remainingOwnerCountDelta,
  } = parser(data.tx)

  return (
    <Trans
      i18nKey={getDescriptionKey(
        isDelete,
        Boolean(feeAmountDelta),
        remainingOwnerCountDelta !== undefined,
      )}
      components={{
        Sponsor: <Account account={sponsor} />,
        Sponsee: <Account account={sponsee} />,
      }}
    />
  )
}
