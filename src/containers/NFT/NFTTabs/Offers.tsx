import { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { useInfiniteQuery } from 'react-query'
import { Loader } from '../../shared/components/Loader'
import './styles.scss'
import NoInfo from '../../shared/images/no_info.svg'
import { useAnalytics } from '../../shared/analytics'
import SocketContext from '../../shared/SocketContext'
import { Amount } from '../../shared/components/Amount'
import '../../shared/components/TransactionTable/styles.scss' // Reuse load-more-btn
import { formatAmount } from '../../../rippled/lib/txSummary/formatAmount'
import { LoadMoreButton } from '../../shared/LoadMoreButton'
import { ACCOUNT_ROUTE } from '../../App/routes'
import { RouteLink } from '../../shared/routing'

interface Props {
  tokenId: string
  offerType: string
  fetchOffers: (
    socket: any,
    id: string,
    limit: number | undefined,
    marker: any,
  ) => Promise<any>
}

export const Offers = (props: Props) => {
  const { t } = useTranslation()
  const { tokenId, fetchOffers, offerType } = props
  const { trackException } = useAnalytics()
  const rippledSocket = useContext(SocketContext)

  const {
    data,
    isFetching: loading,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery(
    [offerType, tokenId],
    ({ pageParam = '' }) =>
      fetchOffers(rippledSocket, tokenId, undefined, pageParam),
    {
      getNextPageParam: (lastPage) => lastPage.marker,
      onError: (_e: any) => {
        trackException(`Cannot find ${offerType} for NFT ${tokenId}`)
      },
    },
  )

  const renderLoadMoreButton = () =>
    hasNextPage && <LoadMoreButton onClick={() => fetchNextPage()} />

  const renderOffer = (d: any) => {
    const { amount, owner, nft_offer_index: offerIndex } = d
    return (
      <tr key={offerIndex}>
        <td className="offer-id text-truncate" title={offerIndex}>
          {offerIndex}
        </td>
        <td className="owner text-truncate">
          <RouteLink to={ACCOUNT_ROUTE} params={{ id: owner }}>
            {owner}
          </RouteLink>
        </td>
        <td className="amount right">
          <Amount value={formatAmount(amount)} />
        </td>
      </tr>
    )
  }

  const renderOffers = () => (
    <div className="offers-table">
      <table className="basic">
        <thead>
          <tr>
            <th className="offer-id">{t('offer_index')}</th>
            <th className="owner">{t('owner')}</th>
            <th className="amount right">{t('amount')}</th>
          </tr>
        </thead>
        <tbody>
          {data ? (
            data.pages.map((page: any) => page.offers.map(renderOffer))
          ) : (
            <tr key="noInfo" className="no-info-panel">
              <td colSpan={3}>
                <div className="no-info-content">
                  {offerType === 'BuyOffers'
                    ? t('no_buy_offers')
                    : t('no_sell_offers')}
                  <NoInfo className="no-info-img" alt="NoInfo" />
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {loading ? <Loader /> : renderLoadMoreButton()}
    </div>
  )

  return <div>{loading ? <Loader /> : renderOffers()}</div>
}
