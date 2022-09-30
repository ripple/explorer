import { createSimpleWrapperFactory } from '../../test'
import { Simple } from '../Simple'
import transactionBuy from './mock_data/NFTokenCreateOffer_Buy.json'
import transactionSell from './mock_data/NFTokenCreateOffer_Sell.json'

const createWrapper = createSimpleWrapperFactory(Simple)

describe('NFTokenCreateOffer', () => {
  it('handles NFTokenCreateOffer buy simple view ', () => {
    const wrapper = createWrapper(transactionBuy)

    expect(wrapper.find('[data-test="token-id"] .value')).toHaveText(
      '000800006203F49C21D5D6E022CB16DE3538F248662FC73C2DCBAB9D00000002',
    )
    expect(wrapper.find('[data-test="offer-id"] .value')).toHaveText(
      '3D1C297DA5B831267CCF692F8A023688D6A4BD5AFAE9A746D5C4E0B15D256B29',
    )
    expect(wrapper.find('[data-test="owner"] .value')).toHaveText(
      'r9AExd6v3keXaXa3nXAMHHcP9nWy9Aef2g',
    )
    expect(wrapper.find('[data-test="amount"] .value')).toHaveText(
      '\uE9000.0001 XRP',
    )
    expect(wrapper.find('[data-test="buyer-or-seller"] .label')).toHaveText(
      'buyer',
    )
    expect(wrapper.find('[data-test="buyer-or-seller"] .value')).toHaveText(
      'rfFRmXUR1yfxeUfXj7WwKhETrtToYx1hYh',
    )
    wrapper.unmount()
  })

  it('handles NFTokenCreateOffer sell simple view ', () => {
    const wrapper = createWrapper(transactionSell)

    expect(wrapper.find('[data-test="token-id"] .value')).toHaveText(
      '000800006203F49C21D5D6E022CB16DE3538F248662FC73C29ABA6A90000000D',
    )
    expect(wrapper.find('[data-test="offer-id"] .value')).toHaveText(
      'F660CA62E16B8067649052E8FCE947049FC6EF0D8B42EF7E5819997EC5AE45B6',
    )
    expect(wrapper.find('[data-test="owner"] .value')).not.toExist()
    expect(wrapper.find('[data-test="amount"] .value')).toHaveText(
      '$100.00 USD.r9AExd6v3keXaXa3nXAMHHcP9nWy9Aef2g',
    )
    expect(wrapper.find('[data-test="buyer-or-seller"] .label')).toHaveText(
      'seller',
    )
    expect(wrapper.find('[data-test="buyer-or-seller"] .value')).toHaveText(
      'r9AExd6v3keXaXa3nXAMHHcP9nWy9Aef2g',
    )
    wrapper.unmount()
  })
})
