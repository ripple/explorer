import { Trans } from 'react-i18next'
import { TransactionDescriptionProps } from '../types'
import { Account } from '../../Account'
import { SponsorshipSet } from './types'
import { parser } from './parser'

export const Description = ({
  data,
}: TransactionDescriptionProps<SponsorshipSet>) => {
  const { sponsor, sponsee, isDelete } = parser(data.tx)

  return (
    <Trans
      i18nKey={
        isDelete ? 'sponsorship_set_delete' : 'sponsorship_set_description'
      }
      components={{
        Sponsor: <Account account={sponsor} />,
        Sponsee: <Account account={sponsee} />,
      }}
    />
  )
}
