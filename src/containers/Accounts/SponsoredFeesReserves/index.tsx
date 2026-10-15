import { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { Account } from '../../shared/components/Account'
import { CollapsibleSection } from '../../shared/components/CollapsibleSection'
import { EmptyMessageTableRow } from '../../shared/EmptyMessageTableRow'
import { Loader } from '../../shared/components/Loader'
import { getAccountSponsorship } from '../../../rippled/lib/rippled'
import SocketContext from '../../shared/SocketContext'
import type { AccountState } from '../../../rippled/accountState'
import './styles.scss'

interface Props {
  account: AccountState
}

type ScopeKey =
  | 'account_page_sponsored_scope_transaction_fees'
  | 'account_page_sponsored_scope_reserve'
  | 'account_page_sponsored_scope_base_reserve'

export const SponsoredFeesReserves = ({ account }: Props) => {
  const { t } = useTranslation()
  const rippledSocket = useContext(SocketContext)

  // Fetched in its own query rather than the account page's Promise.all:
  // account_objects pages up to 10 requests to find Sponsorship objects, so
  // folding it into that Promise.all would fail the whole account page on a
  // single timeout or rate limit here, and would page needlessly for every
  // large account even when the Sponsorship amendment isn't enabled.
  const { data: sponsorship, isLoading } = useQuery(
    ['accountSponsorship', account.account],
    () => getAccountSponsorship(rippledSocket, account.account),
    { enabled: !!account.account },
  )

  const rows: { scopeKey: ScopeKey; sponsor: string }[] = [
    ...(sponsorship ?? [])
      .filter(({ feeAmount }) => Number(feeAmount) > 0)
      .map(({ owner }) => ({
        scopeKey: 'account_page_sponsored_scope_transaction_fees' as ScopeKey,
        sponsor: owner,
      })),
    // A Sponsorship object can carry a reserve budget without a fee budget
    // (XLS-68 §5.7), so it needs its own row distinct from the fees above.
    ...(sponsorship ?? [])
      .filter(({ remainingOwnerCount }) => Number(remainingOwnerCount) > 0)
      .map(({ owner }) => ({
        scopeKey: 'account_page_sponsored_scope_reserve' as ScopeKey,
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

  const renderBody = () => {
    if (isLoading) {
      return (
        <tr>
          <td colSpan={2}>
            <Loader />
          </td>
        </tr>
      )
    }

    if (rows.length === 0) {
      return (
        <EmptyMessageTableRow colSpan={2}>
          {t('account_page_sponsored_none')}
        </EmptyMessageTableRow>
      )
    }

    return rows.map(({ scopeKey, sponsor }) => (
      <tr key={`${scopeKey}-${sponsor}`}>
        <td>{t(scopeKey)}</td>
        <td>
          <Account account={sponsor} />
        </td>
      </tr>
    ))
  }

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
          <tbody>{renderBody()}</tbody>
        </table>
      </div>
    </CollapsibleSection>
  )
}
