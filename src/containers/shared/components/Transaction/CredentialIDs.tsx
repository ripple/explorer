import { useTranslation } from 'react-i18next'
import { SimpleRow } from './SimpleRow'

interface CredentialIDsProps {
  credentialIDs: string[]
}

export const CredentialIDs = ({ credentialIDs }: CredentialIDsProps) => {
  const { t } = useTranslation()

  if (!credentialIDs || credentialIDs.length === 0) {
    return null
  }

  return (
    <SimpleRow label={t('credential_ids')} data-testid="credential-ids">
      {credentialIDs.join(', ')}
    </SimpleRow>
  )
}
