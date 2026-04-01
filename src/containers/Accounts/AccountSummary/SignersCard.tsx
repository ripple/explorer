import { useTranslation } from 'react-i18next'
import { Account } from '../../shared/components/Account'
import { localizeNumber, shortenAccount } from '../../shared/utils'

interface Signer {
  account: string
  weight?: number // Individual weight values cannot exceed 2^16-1.
}

interface SignersCardProps {
  signers: Signer[]
}
const SignersCard = ({ signers }: SignersCardProps) => {
  const { t } = useTranslation()
  return (
    <div className="signers-card card">
      <div className="card-header">
        <div className="header-title">{t('account_page_signers')}</div>
      </div>
      <div className="signers-list">
        {signers.map((signer, i) => (
          <div className="signer-item" key={signer.account || i}>
            <div className="signer-address">
              <Account
                account={signer.account}
                displayText={shortenAccount(signer.account)}
              />
            </div>
            {signer.weight !== undefined && (
              <div className="signer-weight">
                {t('account_page_signer_weight')}{' '}
                {localizeNumber(signer.weight)}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default SignersCard
