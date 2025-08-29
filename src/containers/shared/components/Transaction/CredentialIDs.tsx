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
    <>
      {credentialIDs.map((credentialID, index) => (
        <SimpleRow 
          key={credentialID} 
          label={index === 0 ? t('credential_ids') : ''} 
          data-testid={`credential-id-${index}`}
        >
          {credentialID}
        </SimpleRow>
      ))}
    </>
  )
}