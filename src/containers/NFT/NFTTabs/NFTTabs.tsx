import React from 'react'
import { useParams, useRouteMatch } from 'react-router'
import './styles.scss'
import Tabs from '../../shared/components/Tabs'
import { getBuyNFToffers, getSellNFToffers } from '../../../rippled/lib/rippled'
import Offers from './Offers'
import Transactions from './Transactions'

interface Props {
  tokenId: string
}

const NFTTabs = (props: Props) => {
  const { id = '', tab = 'transactions' } = useParams<{
    id: string
    tab: string
  }>()
  const match = useRouteMatch()
  const { tokenId } = props

  function renderTabs() {
    const { path = '/' } = match
    const tabs = ['transactions', 'buy-offers', 'sell-offers']
    // strips :url from the front and the identifier/tab info from the end
    const mainPath = `${path.split('/:')[0]}/${id}`
    return <Tabs tabs={tabs} selected={tab} path={mainPath} />
  }

  function renderTransactions() {
    let body
    switch (tab) {
      case 'sell-offers':
        body = (
          <Offers
            key="SellOffers"
            tokenId={tokenId}
            fetchOffers={getSellNFToffers}
            offerType="SellOffers"
          />
        )
        break
      case 'buy-offers':
        body = (
          <Offers
            key="BuyOffers"
            tokenId={tokenId}
            fetchOffers={getBuyNFToffers}
            offerType="BuyOffers"
          />
        )
        break
      default:
        body = <Transactions tokenId={tokenId} />
        break
    }
    return <div>{body}</div>
  }
  return (
    <div className="nft-tabs">
      <div>{renderTabs()}</div>
      <div className="tab-body">{renderTransactions()}</div>
    </div>
  )
}

export default NFTTabs
