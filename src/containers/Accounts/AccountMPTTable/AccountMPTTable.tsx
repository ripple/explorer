import { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { useInfiniteQuery } from 'react-query'

import { Loader } from '../../shared/components/Loader'
import SocketContext from '../../shared/SocketContext'
import { useAnalytics } from '../../shared/analytics'
import { EmptyMessageTableRow } from '../../shared/EmptyMessageTableRow'
import { getAccountMPTs } from '../../../rippled/lib/rippled'
import { Account } from '../../shared/components/Account'
import { LoadMoreButton } from '../../shared/LoadMoreButton'
import { MPTokenLink } from '../../shared/components/MPTokenLink'
import { formatMPTokenInfo } from '../../../rippled/lib/utils'

export interface AccountMPTTableProps {
  accountId: string
}

export const AccountMPTTable = ({ accountId }: AccountMPTTableProps) => {
  const rippledSocket = useContext(SocketContext)
  const { trackException } = useAnalytics()
  const {
    data: pages,
    isFetching: loading,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery(
    ['account_objects', accountId],
    ({ pageParam = '' }) =>
      getAccountMPTs(rippledSocket, accountId, pageParam).catch(
        (errorResponse) => {
          const errorLocation = `account MPTs ${accountId} at ${pageParam}`
          trackException(
            `${errorLocation} --- ${JSON.stringify(errorResponse)}`,
          )
        },
      ),
    {
      getNextPageParam: (data) => data.marker,
    },
  )
  const { t } = useTranslation()

  function renderNoResults() {
    return (
      <EmptyMessageTableRow colSpan={3}>
        {t('assets.no_mpts_message')}
      </EmptyMessageTableRow>
    )
  }

  const renderRow = (mpt: any) => (
    <tr key={mpt.mptIssuanceID}>
      <td>
        <MPTokenLink tokenID={mpt.mptIssuanceID} />
      </td>
      <td>
        <Account account={mpt.mptIssuer} />
      </td>
      <td className="right">{mpt.mptAmount}</td>
    </tr>
  )

  const renderLoadMoreButton = () =>
    hasNextPage && <LoadMoreButton onClick={() => fetchNextPage()} />

  const mpts = pages?.pages
    .flatMap((page: any) => page.account_objects)
    .map((mpt) => formatMPTokenInfo(mpt))

  return (
    <div className="section nodes-table">
      <table className="basic">
        <thead>
          <tr>
            <th> {t('mpt_issuance_id')}</th>
            <th> {t('issuer')}</th>
            <th className="right">{t('amount')}</th>
          </tr>
        </thead>
        <tbody>
          {!loading && (mpts?.length ? mpts.map(renderRow) : renderNoResults())}
        </tbody>
      </table>
      {loading ? <Loader /> : renderLoadMoreButton()}
    </div>
  )
}
