import { TableDetail } from '../TableDetail'
import mockOfferCreateInvertedCurrencies from './mock_data/OfferCreateInvertedCurrencies.json'
import mockOfferCreateWithCancel from './mock_data/OfferCreateWithExpirationAndCancel.json'
import mockOfferCreate from './mock_data/OfferCreate.json'
import mockOfferCreateWithPermissionedDomainID from './mock_data/OfferCreateWithPermissionedDomainID.json'
import mockOfferCreateMPT from './mock_data/OfferCreateMPT.json'
import { createTableDetailRenderFactory } from '../../test'
import { useMPTIssuance } from '../../../../hooks/useMPTIssuance'

jest.mock('../../../../hooks/useMPTIssuance', () => ({
  ...jest.requireActual('../../../../hooks/useMPTIssuance'),
  useMPTIssuance: jest.fn(),
}))

const renderComponent = createTableDetailRenderFactory(TableDetail)

describe('OfferCreate: TableDetail', () => {
  beforeEach(() => {
    ;(useMPTIssuance as jest.Mock).mockReturnValue({ data: undefined })
  })

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

  it('renders OfferCreate with MPT (no ticker - displays mpt_issuance_id)', () => {
    ;(useMPTIssuance as jest.Mock).mockReturnValue({
      data: { assetScale: 0 },
    })
    const { container, unmount } = renderComponent(mockOfferCreateMPT)

    // Price pair should show MPT ID
    expect(container.querySelector('[data-testid="pair"]')).toHaveTextContent(
      'price:0.02 \uE900 XRP/000003C31D321B7DDA58324DC38CDF18934FAFFFCDF69D5F',
    )
    // Sell amount should show full MPT ID
    const amounts = container.querySelectorAll('[data-testid="amount"]')
    expect(amounts[1]).toHaveTextContent('50,000.00 XRP')
    expect(amounts[2]).toHaveTextContent(
      '1,000 000003C31D321B7DDA58324DC38CDF18934FAFFFCDF69D5F',
    )
    // MPT link should point to the MPT page
    const mptLink = container.querySelector('a[href*="/mpt/"]')
    expect(mptLink).toHaveAttribute(
      'href',
      '/mpt/000003C31D321B7DDA58324DC38CDF18934FAFFFCDF69D5F',
    )
    unmount()
  })

  it('renders OfferCreate with MPT (with ticker - displays ticker symbol)', () => {
    ;(useMPTIssuance as jest.Mock).mockReturnValue({
      data: { assetScale: 0, parsedMPTMetadata: { ticker: 'XMPT' } },
    })
    const { container, unmount } = renderComponent(mockOfferCreateMPT)

    // Price pair should show ticker instead of shortened ID
    expect(container.querySelector('[data-testid="pair"]')).toHaveTextContent(
      'price:0.02 \uE900 XRP/XMPT',
    )
    // Sell amount should show ticker instead of full ID
    const amounts = container.querySelectorAll('[data-testid="amount"]')
    expect(amounts[2]).toHaveTextContent('1,000 XMPT')
    // MPT link should still point to the MPT page using full ID
    const mptLink = container.querySelector('a[href*="/mpt/"]')
    expect(mptLink).toHaveAttribute(
      'href',
      '/mpt/000003C31D321B7DDA58324DC38CDF18934FAFFFCDF69D5F',
    )
    unmount()
  })
})
