import { Trans } from 'react-i18next'
import { TransactionDescriptionProps } from '../types'
import { Account } from '../../Account'
import { SponsorshipTransfer } from './types'
import { parser } from './parser'

export const Description = ({
  data,
}: TransactionDescriptionProps<SponsorshipTransfer>) => {
  const { operation, account, sponsor, sponsee } = parser(data.tx)

  if (operation === 'create' && sponsor) {
    return (
      <Trans
        i18nKey="sponsorship_transfer_create"
        components={{
          Account: <Account account={account} />,
          Sponsor: <Account account={sponsor} />,
        }}
      />
    )
  }

  if (operation === 'reassign' && sponsor) {
    return (
      <Trans
        i18nKey="sponsorship_transfer_reassign"
        components={{
          Account: <Account account={account} />,
          Sponsor: <Account account={sponsor} />,
        }}
      />
    )
  }

  if (operation === 'end' && sponsee) {
    return (
      <Trans
        i18nKey="sponsorship_transfer_end_other"
        components={{
          Account: <Account account={account} />,
          Sponsee: <Account account={sponsee} />,
        }}
      />
    )
  }

  return (
    <Trans
      i18nKey="sponsorship_transfer_end_self"
      components={{
        Account: <Account account={account} />,
      }}
    />
  )
}
