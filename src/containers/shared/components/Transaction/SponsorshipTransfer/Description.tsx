import { Trans } from 'react-i18next'
import type { SponsorshipTransfer } from 'xrpl'
import { TransactionDescriptionProps } from '../types'
import { Account } from '../../Account'
import { shortenTxHash } from '../../../utils'
import { parser } from './parser'

export const Description = ({
  data,
}: TransactionDescriptionProps<SponsorshipTransfer>) => {
  const { operation, account, objectId, sponsor, sponsee } = parser(data.tx)
  const shortObjectId = objectId ? shortenTxHash(objectId) : undefined

  // An ObjectID scopes the transfer to that object's reserve (XLS-68
  // §10.1.1), not the account's own reserve, so it needs its own wording.
  if (operation === 'create' && sponsor) {
    return (
      <Trans
        i18nKey={
          objectId
            ? 'sponsorship_transfer_create_object'
            : 'sponsorship_transfer_create'
        }
        components={{
          Account: <Account account={account} />,
          Sponsor: <Account account={sponsor} />,
        }}
        values={{ objectId: shortObjectId }}
      />
    )
  }

  if (operation === 'reassign' && sponsor) {
    return (
      <Trans
        i18nKey={
          objectId
            ? 'sponsorship_transfer_reassign_object'
            : 'sponsorship_transfer_reassign'
        }
        components={{
          Account: <Account account={account} />,
          Sponsor: <Account account={sponsor} />,
        }}
        values={{ objectId: shortObjectId }}
      />
    )
  }

  if (operation === 'end') {
    if (sponsee) {
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

    if (objectId) {
      return (
        <Trans
          i18nKey="sponsorship_transfer_end_object"
          components={{
            Account: <Account account={account} />,
          }}
          values={{ objectId: shortObjectId }}
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

  return null
}
