import { useTranslation } from 'react-i18next'

import { useLanguage } from '../../shared/hooks'
import { CollapsibleSection } from '../../shared/components/CollapsibleSection'
import Balances from './Balances'
import DetailsCard from './DetailsCard'
import FlagsCard from './FlagsCard'
import SignersCard from './SignersCard'

import './styles.scss'

interface AccountSummaryProps {
  account: any
  xrpToUSDRate: number
}

export const AccountSummary = ({
  account = {},
  xrpToUSDRate,
}: AccountSummaryProps) => {
  const { t } = useTranslation()
  const lang = useLanguage()

  return (
    <section className="account-summary">
      <Balances account={account} xrpToUSDRate={xrpToUSDRate} />

      <CollapsibleSection
        className="properties"
        title={t('account_page_account_properties')}
        ariaLabel="Toggle account properties"
        defaultOpen={false}
      >
        <div className="properties-grid">
          <FlagsCard account={account} />
          {account.signerList?.signers && (
            <SignersCard signers={account.signerList.signers} />
          )}
          <DetailsCard account={account} lang={lang} />
        </div>
      </CollapsibleSection>
    </section>
  )
}

export default AccountSummary
