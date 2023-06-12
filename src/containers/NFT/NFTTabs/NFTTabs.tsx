import './styles.scss'
import { Tabs } from '../../shared/components/Tabs'
import { getBuyNFToffers, getSellNFToffers } from '../../../rippled/lib/rippled'
import { Offers } from './Offers'
import { Transactions } from './Transactions'
import { NFT } from '../../App/routes'
import { buildPath, useRouteParams } from '../../shared/routing'

interface Props {
  tokenId: string
}

export const NFTTabs = (props: Props) => {
  const { id = '', tab = 'transactions' } = useRouteParams(NFT)
  const { tokenId } = props

  function renderTabs() {
    const tabs = ['transactions', 'buy-offers', 'sell-offers']
    const mainPath = buildPath(NFT, { id })
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
      case 'buy-offers':
        return (
          <Offers
            key="BuyOffers"
            tokenId={tokenId}
            fetchOffers={getBuyNFToffers}
            offerType="BuyOffers"
          />
        )
      default:
        return <Transactions tokenId={tokenId} />
    }
  }

  return (
    <div className="nft-tabs section">
      {renderTabs()}
      <div className="tab-body">{renderTransactions()}</div>
    </div>
  )
}
