import { TableDetail } from '../TableDetail'
import mockOfferCreateInvertedCurrencies from './mock_data/OfferCreateInvertedCurrencies.json'
import mockOfferCreateWithCancel from './mock_data/OfferCreateWithExpirationAndCancel.json'
import mockOfferCreate from './mock_data/OfferCreate.json'
import mockOfferCreateWithPermissionedDomainID from './mock_data/OfferCreateWithPermissionedDomainID.json'
import { createTableDetailRenderFactory } from '../../test'

const renderComponent = createTableDetailRenderFactory(TableDetail)

describe('OfferCreate: TableDetail', () => {
  it('renders with an expiration and offer', () => {
    const { container, unmount } = renderComponent(mockOfferCreateWithCancel)

    expect(container.querySelector('[data-testid="pair"]')).toHaveTextContent(
      'price:612.518 \uE900 XRP/CSC.rCSC',
    )
    expect(
      container.querySelector('[data-testid="cancel-id"]'),
    ).toHaveTextContent('cancel_offer #44866443')
    // Amount components are rendered in order: price (in pair), buy, sell
    // Skip the first one (price) and check buy/sell
    const amounts = container.querySelectorAll('[data-testid="amount"]')
    expect(amounts[1]).toHaveTextContent(`\uE9001,764.293151 XRP`)
    expect(amounts[2]).toHaveTextContent(
      `1,080,661.95882 CSC.rCSCManTZ8ME9EoLrSHHYKW8PPwWMgkwr`,
    )
    unmount()
  })

  it('renders', () => {
    const { container, unmount } = renderComponent(mockOfferCreate)

    expect(container.querySelector('[data-testid="pair"]')).toHaveTextContent(
      'price:0.00207696 \uE900 XRP/BCH.rcyS',
    )
    expect(
      container.querySelector('[data-testid="offer-id"]'),
    ).not.toBeInTheDocument()
    // Amount components are rendered in order: price (in pair), buy, sell
    // Skip the first one (price) and check buy/sell
    const amounts = container.querySelectorAll('[data-testid="amount"]')
    expect(amounts[1]).toHaveTextContent(`\uE90024,755.081083 XRP`)
    expect(amounts[2]).toHaveTextContent(
      `51.41523894 BCH.rcyS4CeCZVYvTiKcxj6Sx32ibKwcDHLds`,
    )
    unmount()
  })

  it('renders inverted currencies', () => {
    const { container, unmount } = renderComponent(
      mockOfferCreateInvertedCurrencies,
    )

    expect(container.querySelector('[data-testid="pair"]')).toHaveTextContent(
      'price:0.346896 \uE900 XRP/USD.rvYA',
    )
    unmount()
  })

  it(`renders offerCreate with a Permissioned Domain ID`, () => {
    const { container, unmount } = renderComponent(
      mockOfferCreateWithPermissionedDomainID,
    )

    expect(
      container.querySelector('[data-testid="domain-id"]'),
    ).toHaveTextContent(
      'domain_id: 4A4879496CFF23CA32242D50DA04DDB41F4561167276A62AF21899F83DF28812',
    )
    unmount()
  })
})
