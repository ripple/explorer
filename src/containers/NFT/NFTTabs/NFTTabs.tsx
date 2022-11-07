import React from 'react'
import { useParams, useRouteMatch } from 'react-router'
import './styles.scss'
import { Tabs } from '../../shared/components/Tabs'
import { getBuyNFToffers, getSellNFToffers } from '../../../rippled/lib/rippled'
import { Offers } from './Offers'

interface Props {
  tokenId: string
}

export const NFTTabs = (props: Props) => {
  const { id = '', tab = 'buy-offers' } = useParams<{
    id: string
    tab: string
  }>()
  const match = useRouteMatch()
  const { tokenId } = props

  function renderTabs() {
    const { path = '/' } = match
    const tabs = ['buy-offers', 'sell-offers']
    // strips :url from the front and the identifier/tab info from the end
    const mainPath = [path.split('/:')[0], id].join('/')
    return <Tabs tabs={tabs} selected={tab} path={mainPath} />
  }

  function renderTransactions() {
    switch (tab) {
      case 'sell-offers':
        return (
          <Offers
            key="SellOffers"
            tokenId={tokenId}
            fetchOffers={getSellNFToffers}
            offerType="SellOffers"
          />
        )
      default:
        return (
          <Offers
            key="BuyOffers"
            tokenId={tokenId}
            fetchOffers={getBuyNFToffers}
            offerType="BuyOffers"
          />
        )
    }
  }

  return (
    <div className="nft-tabs section">
      {renderTabs()}
      <div className="tab-body">{renderTransactions()}</div>
    </div>
  )
}
