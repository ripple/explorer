import { useTranslation } from 'react-i18next'
import { TransactionTableDetailProps } from '../types'
import { DepositPreauth } from './types'
import { Account } from '../../Account'
import { convertHexToString } from '../../../../../rippled/lib/utils'

export const TableDetail = ({
  instructions,
}: TransactionTableDetailProps<DepositPreauth>) => {
  const { t } = useTranslation()
  const {
    Authorize,
    Unauthorize,
    AuthorizeCredentials,
    UnauthorizeCredentials,
  } = instructions

  if (Authorize) {
    return (
      <div className="deposit-preauth">
        <span className="label">{t('authorize')}</span>
        <Account account={Authorize} />
      </div>
    )
  }

  if (Unauthorize) {
    return (
      <div className="deposit-preauth">
        <span className="label">{t('unauthorize')}</span>
        <Account account={Unauthorize} />
      </div>
    )
  }

  if (AuthorizeCredentials && AuthorizeCredentials.length > 0) {
    return (
      <div className="deposit-preauth">
        <span className="label">
          {t('authorize')} {t('accepted_credentials')}
        </span>
        <div className="credentials">
          {AuthorizeCredentials.map((cred, index) => (
            <div
              key={`${cred.Issuer}-${cred.CredentialType}`}
              className="credential"
            >
              <span className="credential-type">
                {convertHexToString(cred.CredentialType)}
              </span>
              <span className="credential-issuer">
                <Account account={cred.Issuer} />
              </span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (UnauthorizeCredentials && UnauthorizeCredentials.length > 0) {
    return (
      <div className="deposit-preauth">
        <span className="label">
          {t('unauthorize')} {t('accepted_credentials')}
        </span>
        <div className="credentials">
          {UnauthorizeCredentials.map((cred, index) => (
            <div
              key={`${cred.Issuer}-${cred.CredentialType}`}
              className="credential"
            >
              <span className="credential-type">
                {convertHexToString(cred.CredentialType)}
              </span>
              <span className="credential-issuer">
                <Account account={cred.Issuer} />
              </span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return null
}
