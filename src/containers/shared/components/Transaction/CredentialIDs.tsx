import { useTranslation } from 'react-i18next'
import { SimpleRow } from './SimpleRow'

interface CredentialIDsProps {
  credentialIDs: string[]
  inline?: boolean
}

export const CredentialIDs = ({
  credentialIDs,
  inline = false,
}: CredentialIDsProps) => {
  const { t } = useTranslation()

  if (!credentialIDs || credentialIDs.length === 0) {
    return null
  }

  if (inline) {
    return (
      <div className="credential-ids">
        <span className="label">{t('credential_ids')}: </span>
        {credentialIDs.map((id) => (
          <div key={id} className="credential-id">
            {id}
          </div>
        ))}
      </div>
    )
  }

  return (
    <>
      {credentialIDs.map((id, index) => (
        <SimpleRow
          key={id}
          label={index === 0 ? t('credential_ids') : ''}
          data-testid={`credential-id-${index}`}
        >
          {id}
        </SimpleRow>
      ))}
    </>
  )
}
