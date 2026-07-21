import { useTranslation } from 'react-i18next'
import { Account } from '../../shared/components/Account'
import { shortenAccount } from '../../shared/utils'
import type { AccountState } from '../../../rippled/accountState'
import './styles.scss'

interface Props {
  account: AccountState
}

type ScopeKey =
  | 'account_page_sponsored_scope_transaction_fees'
  | 'account_page_sponsored_scope_base_reserve'

export const SponsoredFeesReserves = ({ account }: Props) => {
  const { t } = useTranslation()

  const rows: { scopeKey: ScopeKey; sponsor: string }[] = (
    [
      {
        scopeKey: 'account_page_sponsored_scope_transaction_fees',
        sponsor: account.sponsorship?.owner,
      },
      {
        scopeKey: 'account_page_sponsored_scope_base_reserve',
        sponsor: account.info?.sponsor,
      },
    ] as { scopeKey: ScopeKey; sponsor: string | undefined }[]
  ).filter((row): row is { scopeKey: ScopeKey; sponsor: string } =>
    Boolean(row.sponsor),
  )

  return (
    <div className="sponsored-fees-reserves-section">
      <h2 className="sponsored-fees-reserves-title">
        {t('account_page_sponsored_fees_reserves_title')}
      </h2>
      <div className="sponsored-fees-reserves-table-wrapper">
        <table className="sponsored-fees-reserves-table">
          <thead>
            <tr>
              <th>{t('account_page_sponsored_scope')}</th>
              <th>{t('account_page_sponsored_by')}</th>
              <th>{t('status')}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ scopeKey, sponsor }) => (
              <tr key={scopeKey}>
                <td>{t(scopeKey)}</td>
                <td>
                  <Account
                    account={sponsor}
                    displayText={shortenAccount(sponsor)}
                  />
                </td>
                <td>{t('account_page_sponsored_status_active')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
