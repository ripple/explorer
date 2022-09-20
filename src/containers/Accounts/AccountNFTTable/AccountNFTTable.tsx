import React, { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { useInfiniteQuery } from 'react-query'
import { Link } from 'react-router-dom'

import { ANALYTIC_TYPES, analytics } from '../../shared/utils'
import Loader from '../../shared/components/Loader'
import SocketContext from '../../shared/SocketContext'
import { EmptyMessageTableRow } from '../../shared/EmptyMessageTableRow'
import { getAccountNFTs } from '../../../rippled/lib/rippled'
import Account from '../../shared/components/Account'
import { LoadMoreButton } from '../../shared/LoadMoreButton'

export interface AccountNFTTableProps {
  accountId: string
}

export const AccountNFTTable = ({ accountId }: AccountNFTTableProps) => {
  const rippledSocket = useContext(SocketContext)
  const {
    data: pages,
    isFetching: loading,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery(
    ['account_nfts', accountId],
    ({ pageParam = '' }) =>
      getAccountNFTs(rippledSocket, accountId, pageParam).catch(
        (errorResponse) => {
          const errorLocation = `account NFTs ${accountId} at ${pageParam}`
          analytics(ANALYTIC_TYPES.exception, {
            exDescription: `${errorLocation} --- ${JSON.stringify(
              errorResponse,
            )}`,
          })
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
        {t('assets.no_nfts_message')}
      </EmptyMessageTableRow>
    )
  }

  const renderRow = (nft: any) => (
    <tr key={nft.NFTokenID}>
      <td>
        <Link to={`/token/${nft.NFTokenID}`}>{nft.NFTokenID}</Link>
      </td>
      <td>
        <Account account={nft.Issuer} />
      </td>
      <td>{nft.NFTokenTaxon}</td>
    </tr>
  )

  const renderLoadMoreButton = () =>
    hasNextPage && <LoadMoreButton onClick={() => fetchNextPage()} />

  const nfts = pages?.pages.flatMap((page: any) => page.account_nfts)
  return (
    <div className="section nfts-table">
      <table className="basic">
        <thead>
          <tr>
            <th className="col-token-id">{t('token_id')}</th>
            <th className="col-issuer">{t('issuer')}</th>
            <th className="col-taxon">{t('taxon')}</th>
          </tr>
        </thead>
        <tbody>
          {!loading && (nfts?.length ? nfts.map(renderRow) : renderNoResults())}
        </tbody>
      </table>
      {loading ? <Loader /> : renderLoadMoreButton()}
    </div>
  )
}
