import { useTranslation } from 'react-i18next'
import type { AccountDelete } from 'xrpl'

import { SimpleRow } from '../SimpleRow'
import { TransactionSimpleProps } from '../types'
import { Account } from '../../Account'
import { CredentialIDs } from '../CredentialIDs'

// Extend the AccountDelete type to include CredentialIDs
interface AccountDeleteWithCredentials extends AccountDelete {
  CredentialIDs?: string[]
}

export const Simple = ({
  data,
}: TransactionSimpleProps<AccountDeleteWithCredentials>) => {
  const { t } = useTranslation()
  const tx = data.instructions

  return (
    <>
      <SimpleRow label={t('destination')} data-testid="destination">
        <Account account={tx.Destination} />
        {tx.DestinationTag && <span className="dt">:{tx.DestinationTag}</span>}
      </SimpleRow>
      {tx.CredentialIDs && tx.CredentialIDs.length > 0 && (
        <CredentialIDs credentialIDs={tx.CredentialIDs} />
      )}
    </>
  )
}
