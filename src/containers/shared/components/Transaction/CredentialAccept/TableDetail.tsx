import { useTranslation } from 'react-i18next'
import { type CredentialAccept } from 'xrpl'
import { TransactionTableDetailProps } from '../types'
import { convertHexToString } from '../../../../../rippled/lib/utils'

export const TableDetail = ({
  instructions,
}: TransactionTableDetailProps<CredentialAccept>) => {
  const { t } = useTranslation()
  const { Issuer: issuer, CredentialType: credentialType } = instructions
  return (
    <div className="credentialAccept">
      <div data-testid="issuer">
        <span className="label">{t('issuer')}: </span>
        <span className="case-sensitive">{issuer}</span>
      </div>

      <div data-testid="credential-type">
        <span className="label">{t('credential_type')}: </span>
        <span className="case-sensitive">
          {convertHexToString(credentialType)}
        </span>
      </div>
    </div>
  )
}
