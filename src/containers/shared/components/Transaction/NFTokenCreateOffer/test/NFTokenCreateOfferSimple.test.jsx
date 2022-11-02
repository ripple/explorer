import { createSimpleWrapperFactory, expectSimpleRowText } from '../../test'
import { Simple } from '../Simple'
import transactionBuy from './mock_data/NFTokenCreateOffer_Buy.json'
import transactionSell from './mock_data/NFTokenCreateOffer_Sell.json'
import transactionFailed from './mock_data/NFTokenCreateOfferFailed.json'

const createWrapper = createSimpleWrapperFactory(Simple)

describe('NFTokenCreateOffer', () => {
  it('handles NFTokenCreateOffer buy simple view ', () => {
    const wrapper = createWrapper(transactionBuy)
    expectSimpleRowText(
      wrapper,
      'token-id',
      '000800006203F49C21D5D6E022CB16DE3538F248662FC73C2DCBAB9D00000002',
    )
    expectSimpleRowText(
      wrapper,
      'offer-id',
      '3D1C297DA5B831267CCF692F8A023688D6A4BD5AFAE9A746D5C4E0B15D256B29',
    )
    expectSimpleRowText(wrapper, 'owner', 'r9AExd6v3keXaXa3nXAMHHcP9nWy9Aef2g')
    expectSimpleRowText(wrapper, 'amount', '\uE9000.0001 XRP')

    expect(wrapper.find('[data-test="buyer-or-seller"] .label')).toHaveText(
      'buyer',
    )
    expectSimpleRowText(
      wrapper,
      'buyer-or-seller',
      'rfFRmXUR1yfxeUfXj7WwKhETrtToYx1hYh',
    )
    wrapper.unmount()
  })

  it('handles NFTokenCreateOffer sell simple view ', () => {
    const wrapper = createWrapper(transactionSell)
    expectSimpleRowText(
      wrapper,
      'token-id',
      '000800006203F49C21D5D6E022CB16DE3538F248662FC73C29ABA6A90000000D',
    )
    expectSimpleRowText(
      wrapper,
      'offer-id',
      'F660CA62E16B8067649052E8FCE947049FC6EF0D8B42EF7E5819997EC5AE45B6',
    )
    expect(wrapper.find('[data-test="owner"] .value')).not.toExist()
    expectSimpleRowText(
      wrapper,
      'amount',
      '$100.00 USD.r9AExd6v3keXaXa3nXAMHHcP9nWy9Aef2g',
    )
    expect(wrapper.find('[data-test="buyer-or-seller"] .label')).toHaveText(
      'seller',
    )
    expectSimpleRowText(
      wrapper,
      'buyer-or-seller',
      'r9AExd6v3keXaXa3nXAMHHcP9nWy9Aef2g',
    )
    wrapper.unmount()
  })

  it('handles failed NFTokenCreateOffer transaction', () => {
    const wrapper = createWrapper(transactionFailed)
    expectSimpleRowText(
      wrapper,
      'token-id',
      '00080000AC7377C74DD53E77C8161537F5EBF56B0CE8FD3BD392C2B800001702',
    )
    expect(wrapper.find('[data-test="offer-id"] .value')).not.toExist()
    expect(wrapper.find('[data-test="owner"] .value')).not.toExist()
    expectSimpleRowText(wrapper, 'amount', '\uE900500.00 XRP')
    wrapper.unmount()
  })
})
