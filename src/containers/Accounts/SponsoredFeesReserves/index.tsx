import { useTranslation } from 'react-i18next'
import { Account } from '../../shared/components/Account'
import { CollapsibleSection } from '../../shared/components/CollapsibleSection'
import { EmptyMessageTableRow } from '../../shared/EmptyMessageTableRow'
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

  const rows: { scopeKey: ScopeKey; sponsor: string }[] = [
    ...(account.sponsorship ?? []).map(({ owner }) => ({
      scopeKey: 'account_page_sponsored_scope_transaction_fees' as ScopeKey,
      sponsor: owner,
    })),
    ...(account.info?.sponsor
      ? [
          {
            scopeKey: 'account_page_sponsored_scope_base_reserve' as ScopeKey,
            sponsor: account.info.sponsor,
          },
        ]
      : []),
  ]

  return (
    <CollapsibleSection
      title={t('account_page_sponsored_fees_reserves_title')}
      ariaLabel="Toggle sponsored fees & reserves section"
      className="sponsored-fees-reserves-section"
      defaultOpen={false}
    >
      <div className="sponsored-fees-reserves-table-wrapper">
        <table className="sponsored-fees-reserves-table">
          <thead>
            <tr>
              <th>{t('account_page_sponsored_scope')}</th>
              <th>{t('account_page_sponsored_by')}</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <EmptyMessageTableRow colSpan={2}>
                {t('account_page_sponsored_none')}
              </EmptyMessageTableRow>
            ) : (
              rows.map(({ scopeKey, sponsor }) => (
                <tr key={`${scopeKey}-${sponsor}`}>
                  <td>{t(scopeKey)}</td>
                  <td>
                    <Account account={sponsor} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </CollapsibleSection>
  )
}
