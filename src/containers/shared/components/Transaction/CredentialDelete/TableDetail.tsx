import { useTranslation } from 'react-i18next'
import { type CredentialDelete } from 'xrpl'
import { TransactionTableDetailProps } from '../types'
import { convertHexToString } from '../../../../../rippled/lib/utils'

export const TableDetail = ({
  instructions,
}: TransactionTableDetailProps<CredentialDelete>) => {
  const { t } = useTranslation()
  const { Account, Subject, Issuer, CredentialType } = instructions
  return (
    <div className="credentialDelete">
      <div className="subject">
        <span className="label">{t('subject')}: </span>
        <span className="case-sensitive">{Subject || Account}</span>
      </div>

      <div className="issuer">
        <span className="label">{t('issuer')}: </span>
        <span className="case-sensitive">{Issuer || Account}</span>
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
