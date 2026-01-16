import { createSimpleRenderFactory, expectSimpleRowText } from '../../test'
import { Simple } from '../Simple'
import transactionBuy from './mock_data/NFTokenCreateOffer_Buy.json'
import transactionSell from './mock_data/NFTokenCreateOffer_Sell.json'
import transactionFailed from './mock_data/NFTokenCreateOfferFailed.json'
import transactionDestination from './mock_data/NFTokenCreateOfferDestination.json'

const renderComponent = createSimpleRenderFactory(Simple)

describe('NFTokenCreateOffer', () => {
  it('handles NFTokenCreateOffer buy simple view ', () => {
    const { container, unmount } = renderComponent(transactionBuy)
    expectSimpleRowText(
      container,
      'token-id',
      '000800006203F49C21D5D6E022CB16DE3538F248662FC73C2DCBAB9D00000002',
    )
    expectSimpleRowText(
      container,
      'offer-id',
      '3D1C297DA5B831267CCF692F8A023688D6A4BD5AFAE9A746D5C4E0B15D256B29',
    )
    expectSimpleRowText(
      container,
      'owner',
      'r9AExd6v3keXaXa3nXAMHHcP9nWy9Aef2g',
    )
    expectSimpleRowText(container, 'amount', '\uE9000.0001 XRP')
    expect(
      container.querySelector('[data-testid="buyer-or-seller"] .label'),
    ).toHaveTextContent('buyer')
    expectSimpleRowText(
      container,
      'buyer-or-seller',
      'rfFRmXUR1yfxeUfXj7WwKhETrtToYx1hYh',
    )
    expect(
      container.querySelector('[data-testid="destination"] .value'),
    ).not.toBeInTheDocument()
    unmount()
  })

  it('handles NFTokenCreateOffer sell simple view ', () => {
    const { container, unmount } = renderComponent(transactionSell)
    expectSimpleRowText(
      container,
      'token-id',
      '000800006203F49C21D5D6E022CB16DE3538F248662FC73C29ABA6A90000000D',
    )
    expectSimpleRowText(
      container,
      'offer-id',
      'F660CA62E16B8067649052E8FCE947049FC6EF0D8B42EF7E5819997EC5AE45B6',
    )
    expect(
      container.querySelector('[data-testid="owner"] .value'),
    ).not.toBeInTheDocument()
    expectSimpleRowText(
      container,
      'amount',
      '$100.00 USD.r9AExd6v3keXaXa3nXAMHHcP9nWy9Aef2g',
    )
    expect(
      container.querySelector('[data-testid="buyer-or-seller"] .label'),
    ).toHaveTextContent('seller')
    expectSimpleRowText(
      container,
      'buyer-or-seller',
      'r9AExd6v3keXaXa3nXAMHHcP9nWy9Aef2g',
    )
    expect(
      container.querySelector('[data-testid="destination"] .value'),
    ).not.toBeInTheDocument()
    unmount()
  })

  it('handles failed NFTokenCreateOffer transaction', () => {
    const { container, unmount } = renderComponent(transactionFailed)
    expectSimpleRowText(
      container,
      'token-id',
      '00080000AC7377C74DD53E77C8161537F5EBF56B0CE8FD3BD392C2B800001702',
    )
    expect(
      container.querySelector('[data-testid="offer-id"] .value'),
    ).not.toBeInTheDocument()
    expect(
      container.querySelector('[data-testid="owner"] .value'),
    ).not.toBeInTheDocument()
    expectSimpleRowText(container, 'amount', '\uE900500.00 XRP')
    unmount()
  })

  it('handles NFTokenCreateOffer with destination', () => {
    const { container, unmount } = renderComponent(transactionDestination)
    expectSimpleRowText(
      container,
      'destination',
      'rpdUbED32X3YXRPBGzSv8gMTJE66t3sji9',
    )
    unmount()
  })
})
