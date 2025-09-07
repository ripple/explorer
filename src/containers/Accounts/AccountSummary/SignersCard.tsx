import { useTranslation } from 'react-i18next'
import { Account } from '../../shared/components/Account'
import { shortenAccount } from '../../../rippled/lib/utils'

interface Signer {
  account: string
  weight?: number
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
                shortAccount={shortenAccount(signer.account)}
              />
            </div>
            {signer.weight !== undefined && (
              <div className="signer-weight">
                {t('account_page_signer_weight')} {signer.weight}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default SignersCard
