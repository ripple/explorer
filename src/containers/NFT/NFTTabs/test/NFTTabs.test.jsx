import { mount } from 'enzyme'
import { I18nextProvider } from 'react-i18next'
import { MemoryRouter as Router, Route } from 'react-router-dom'
import { QueryClientProvider } from 'react-query'
import { describe, it, expect } from 'vitest'
import { NFTTabs } from '../NFTTabs'
import i18n from '../../../../i18n/testConfig'
import { queryClient } from '../../../shared/QueryClient'

describe('NFT Transactions tab container', () => {
  const nftId =
    '000800011C7D8ED1D715A0017E41BF9499ECC17E7FB666320000099B00000000'

  const createWrapper = (tab = 'transactions') =>
    mount(
      <QueryClientProvider client={queryClient}>
        <I18nextProvider i18n={i18n}>
          <Router initialEntries={[`/nft/${nftId}/${tab}`]}>
            <Route path="/nft/:id/:tab?" component={NFTTabs} />
          </Router>
        </I18nextProvider>
      </QueryClientProvider>,
    )

  it('renders without crashing', () => {
    const wrapper = createWrapper()
    wrapper.unmount()
  })

  it('renders transactions tab', () => {
    const wrapper = createWrapper()
    expect(wrapper.find('.tabs').length).toBe(1)
    expect(wrapper.find('a.tab').length).toBe(3)
    expect(wrapper.find('a.tab').at(0).props().title).toBe('transactions')
    expect(wrapper.find('a.tab').at(1).props().title).toBe('buy_offers')
    expect(wrapper.find('a.tab').at(2).props().title).toBe('sell_offers')
    expect(wrapper.find('a.tab.selected').text()).toEqual('transactions')
    wrapper.unmount()
  })

  it('renders buy offers tab', () => {
    const wrapper = createWrapper('buy-offers')
    expect(wrapper.find('a.tab.selected').text()).toEqual('buy_offers')
    wrapper.unmount()
  })

  it('renders sell offers tab', () => {
    const wrapper = createWrapper('sell-offers')
    expect(wrapper.find('a.tab.selected').text()).toEqual('sell_offers')
    wrapper.unmount()
  })
})
