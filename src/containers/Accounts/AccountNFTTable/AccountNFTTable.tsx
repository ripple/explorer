import { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { useInfiniteQuery } from 'react-query'

import { Loader } from '../../shared/components/Loader'
import SocketContext from '../../shared/SocketContext'
import { useAnalytics } from '../../shared/analytics'
import { EmptyMessageTableRow } from '../../shared/EmptyMessageTableRow'
import { getAccountNFTs } from '../../../rippled/lib/rippled'
import { Account } from '../../shared/components/Account'
import { LoadMoreButton } from '../../shared/LoadMoreButton'
import { NFTokenLink } from '../../shared/components/NFTokenLink'

export interface AccountNFTTableProps {
  accountId: string
}

export const AccountNFTTable = ({ accountId }: AccountNFTTableProps) => {
  const rippledSocket = useContext(SocketContext)
  const { trackException } = useAnalytics()
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
        {t('assets.no_nfts_message')}
      </EmptyMessageTableRow>
    )
  }

  const renderRow = (nft: any) => (
    <tr key={nft.NFTokenID}>
      <td>
        <NFTokenLink tokenID={nft.NFTokenID} />
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
