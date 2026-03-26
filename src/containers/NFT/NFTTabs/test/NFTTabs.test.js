import { render } from '@testing-library/react'
import { Route } from 'react-router-dom'
import { NFTTabs } from '../NFTTabs'
import i18n from '../../../../i18n/testConfig'
import { QuickHarness } from '../../../test/utils'
import { NFT_ROUTE } from '../../../App/routes'

describe('NFT Transactions tab container', () => {
  const nftId =
    '000800011C7D8ED1D715A0017E41BF9499ECC17E7FB666320000099B00000000'

  const renderNFTTabs = (tab = 'transactions') =>
    render(
      <QuickHarness i18n={i18n} initialEntries={[`/nft/${nftId}/${tab}`]}>
        <Route path={NFT_ROUTE.path} element={<NFTTabs />} />
      </QuickHarness>,
    )

  it('renders without crashing', () => {
    renderNFTTabs()
  })

  it('renders transactions tab', () => {
    const { container } = renderNFTTabs()
    expect(container.querySelectorAll('.tabs').length).toBe(1)
    const tabs = container.querySelectorAll('a.tab')
    expect(tabs.length).toBe(3)
    expect(tabs[0].getAttribute('title')).toBe('transactions')
    expect(tabs[1].getAttribute('title')).toBe('buy_offers')
    expect(tabs[2].getAttribute('title')).toBe('sell_offers')
    expect(container.querySelector('a.tab.selected').textContent).toEqual(
      'transactions',
    )
  })

  it('renders buy offers tab', () => {
    const { container } = renderNFTTabs('buy-offers')
    expect(container.querySelector('a.tab.selected').textContent).toEqual(
      'buy_offers',
    )
  })

  it('renders sell offers tab', () => {
    const { container } = renderNFTTabs('sell-offers')
    expect(container.querySelector('a.tab.selected').textContent).toEqual(
      'sell_offers',
    )
  })
})
