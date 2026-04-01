import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useLanguage } from '../../shared/hooks'
import ArrowIcon from '../../shared/images/down_arrow.svg'
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
  const [propertiesOpen, setPropertiesOpen] = useState(false)

  return (
    <section className="account-summary">
      <Balances account={account} xrpToUSDRate={xrpToUSDRate} />

      <div className="properties">
        <div className="properties-header">
          <h3>{t('account_page_account_properties')}</h3>
          <button
            type="button"
            className="properties-toggle"
            onClick={() => setPropertiesOpen((s) => !s)}
            aria-expanded={propertiesOpen}
            aria-label="Toggle account properties"
          >
            <ArrowIcon
              className={`properties-arrow ${propertiesOpen ? 'open' : ''}`}
            />
          </button>
        </div>
        {propertiesOpen && (
          <div className="properties-grid">
            <FlagsCard account={account} />
            {account.signerList?.signers && (
              <SignersCard signers={account.signerList.signers} />
            )}
            <DetailsCard account={account} lang={lang} />
          </div>
        )}
      </div>
    </section>
  )
}

export default AccountSummary
