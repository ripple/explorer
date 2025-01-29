import { useTranslation } from 'react-i18next'
import { type CredentialDelete } from 'xrpl'
import { TransactionTableDetailProps } from '../types'
import { convertHexToString } from '../../../../../rippled/lib/utils'

export const TableDetail = ({
  instructions,
}: TransactionTableDetailProps<CredentialDelete>) => {
  const { t } = useTranslation()
  const {
    Account: account,
    Subject: subject,
    Issuer: issuer,
    CredentialType: credentialType,
  } = instructions
  return (
    <div className="credentialDelete">
      <div className="subject">
        <span className="label">{t('subject')}: </span>
        <span className="case-sensitive">{subject || account}</span>
      </div>

      <div className="issuer">
        <span className="label">{t('issuer')}: </span>
        <span className="case-sensitive">{issuer || account}</span>
      </div>

      <div className="credential-type">
        <span className="label">{t('credential_type')}: </span>
        <span className="case-sensitive">
          {convertHexToString(credentialType)}
        </span>
      </div>
    </div>
  )
}
