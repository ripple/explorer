import React, { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { useInfiniteQuery } from 'react-query'
import { Link } from 'react-router-dom'
import Loader from '../../shared/components/Loader'
import './styles.scss'
import noInfo from '../../shared/images/no_info.svg'
import SocketContext from '../../shared/SocketContext'
import { Amount } from '../../shared/components/Amount'
import { analytics, ANALYTIC_TYPES } from '../../shared/utils'
import '../../shared/components/TransactionTable/styles.scss' // Reuse load-more-btn
import formatAmount from '../../../rippled/lib/txSummary/formatAmount'

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
  const rippledSocket = useContext(SocketContext)

  const {
    data,
    isFetching: loading,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery(
    [offerType],
    ({ pageParam = '' }) =>
      fetchOffers(rippledSocket, tokenId, undefined, pageParam),
    {
      getNextPageParam: (lastPage) => lastPage.marker,
      onError: (_e: any) => {
        /* @ts-ignore */
        analytics(ANALYTIC_TYPES.exception, {
          exDescription: `Cannot find ${offerType} for NFT ${tokenId}`,
        })
      },
    },
  )

  const renderLoadMoreButton = () =>
    hasNextPage && (
      <button
        type="button"
        className="load-more-btn"
        onClick={() => fetchNextPage()}
      >
        {t('load_more_action')}
      </button>
    )

  const renderOffer = (d: any) => {
    const { amount, owner, nft_offer_index: offerIndex } = d
    const formattedAmount = formatAmount(amount)
    return (
      <tr key={offerIndex}>
        <td className="offer-id text-truncate" title={offerIndex}>
          {offerIndex}
        </td>
        <td className="owner text-truncate">
          <Link to={`/accounts/${owner}`}>{owner}</Link>
        </td>
        <td className="amount right">
          <Amount
            value={{
              ...formattedAmount,
              amount: formattedAmount.amount.toString(),
            }}
          />
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
                  {t('no_additional_info')}
                  <img src={noInfo} alt="noInfo" />
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
