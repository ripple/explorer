import { Simple } from '../Simple'
import mockOfferCreateWithCancel from './mock_data/OfferCreateWithExpirationAndCancel.json'
import mockOfferCreate from './mock_data/OfferCreate.json'
import mockOfferCreateWithPermissionedDomainID from './mock_data/OfferCreateWithPermissionedDomainID.json'
import { createSimpleRenderFactory } from '../../test/createWrapperFactory'

const renderComponent = createSimpleRenderFactory(Simple)

describe('OfferCreate: Simple', () => {
  it('renders with an expiration and offer', () => {
    const { container, unmount } = renderComponent(mockOfferCreateWithCancel)
    expect(container.querySelector('[data-testid="amount"] .one-line')).toHaveTextContent(
      '\uE900 XRP/CSC.rCSC',
    )
    expect(container.querySelector('[data-testid="cancel-id"] .value')).toHaveTextContent(
      '#44866443',
    )
    expect(container.querySelector('[data-testid="amount-buy"] .value')).toHaveTextContent(
      `\uE9001,764.293151 XRP`,
    )
    expect(container.querySelector('[data-testid="amount-sell"] .value')).toHaveTextContent(
      `1,080,661.95882 CSC.rCSCManTZ8ME9EoLrSHHYKW8PPwWMgkwr`,
    )
    unmount()
  })

  it('renders', () => {
    const { container, unmount } = renderComponent(mockOfferCreate)

    expect(container.querySelector('[data-testid="offer-id"] .value')).not.toBeInTheDocument()
    expect(container.querySelector('[data-testid="amount-buy"] .value')).toHaveTextContent(
      `\uE90024,755.081083 XRP`,
    )
    expect(container.querySelector('[data-testid="amount-sell"] .value')).toHaveTextContent(
      `51.41523894 BCH.rcyS4CeCZVYvTiKcxj6Sx32ibKwcDHLds`,
    )
  })

  it(`renders offerCreate with a Permissioned Domain ID`, () => {
    const { container, unmount } = renderComponent(mockOfferCreateWithPermissionedDomainID)

    expect(container.querySelector('[data-testid="domain-id"] .value')).toHaveTextContent(
      '4A4879496CFF23CA32242D50DA04DDB41F4561167276A62AF21899F83DF28812',
    )
  })
})
