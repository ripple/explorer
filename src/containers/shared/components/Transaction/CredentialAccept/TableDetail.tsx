import { useTranslation } from 'react-i18next'
import { type CredentialAccept } from 'xrpl'
import { TransactionTableDetailProps } from '../types'
import { convertHexToString } from '../../../../../rippled/lib/utils'

export const TableDetail = ({
  instructions,
}: TransactionTableDetailProps<CredentialAccept>) => {
  const { t } = useTranslation()
  const { Issuer, CredentialType } = instructions
  return (
    <div className="credentialAccept">
      <div className="issuer">
        <span className="label">{t('issuer')}: </span>
        <span className="case-sensitive">{Issuer}</span>
      </div>

      <div className="credential-type">
        <span className="label">{t('credential_type')}: </span>
        <span className="case-sensitive">
          {convertHexToString(CredentialType)}
        </span>
      </div>
    </div>
  )
}
