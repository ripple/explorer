import { useTranslation } from 'react-i18next'
import { type CredentialCreate } from 'xrpl'
import { TransactionTableDetailProps } from '../types'
import { convertHexToString } from '../../../../../rippled/lib/utils'

export const TableDetail = ({
  instructions,
}: TransactionTableDetailProps<CredentialCreate>) => {
  const { t } = useTranslation()
  const {
    Subject: subject,
    CredentialType: credentialType,
    Expiration: expiration,
    URI: uri,
  } = instructions
  return (
    <div className="credentialCreate">
      <div data-testid="subject">
        <span className="label">{t('subject')}: </span>
        <span className="case-sensitive">{subject}</span>
      </div>

      <div data-testid="credential-type">
        <span className="label">{t('credential_type')}: </span>
        <span className="case-sensitive">
          {convertHexToString(credentialType)}
        </span>
      </div>

      {expiration && (
        <div data-testid="expiration">
          <span className="label">{t('expiration')}: </span>
          <span className="case-sensitive">{expiration}</span>
        </div>
      )}
      {uri && (
        <div data-testid="uri">
          <span className="label">{t('uri')}: </span>
          <span className="case-sensitive">{convertHexToString(uri)}</span>
        </div>
      )}
    </div>
  )
}
