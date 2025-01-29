import { useTranslation } from 'react-i18next'
import { type CredentialCreate } from 'xrpl'
import { TransactionTableDetailProps } from '../types'
import { convertHexToString } from '../../../../../rippled/lib/utils'

export const TableDetail = ({
  instructions,
}: TransactionTableDetailProps<CredentialCreate>) => {
  const { t } = useTranslation()
  const { Subject, CredentialType, Expiration, URI } = instructions
  return (
    <div className="credentialCreate">
      <div className="issuer">
        <span className="label">{t('subject')}: </span>
        <span className="case-sensitive">{Subject}</span>
      </div>

      <div className="credential-type">
        <span className="label">{t('credential_type')}: </span>
        <span className="case-sensitive">
          {convertHexToString(CredentialType)}
        </span>
      </div>

      {Expiration && (
        <div className="expiration">
          <span className="label">{t('expiration')}: </span>
          <span className="case-sensitive">{Expiration}</span>
        </div>
      )}
      {URI && (
        <div className="uri">
          <span className="label">{t('uri')}: </span>
          <span className="case-sensitive">{URI}</span>
        </div>
      )}
    </div>
  )
}
