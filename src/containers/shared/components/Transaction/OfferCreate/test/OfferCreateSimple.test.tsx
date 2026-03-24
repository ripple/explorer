import { Simple } from '../Simple'
import mockOfferCreateWithCancel from './mock_data/OfferCreateWithExpirationAndCancel.json'
import mockOfferCreate from './mock_data/OfferCreate.json'
import mockOfferCreateWithPermissionedDomainID from './mock_data/OfferCreateWithPermissionedDomainID.json'
import mockOfferCreateMPT from './mock_data/OfferCreateMPT.json'
import mockOfferCreateMPTPayIOU from './mock_data/OfferCreateMPTPayIOU.json'
import { createSimpleRenderFactory } from '../../test/createWrapperFactory'
import { useMPTIssuance } from '../../../../hooks/useMPTIssuance'

jest.mock('../../../../hooks/useMPTIssuance', () => ({
  ...jest.requireActual('../../../../hooks/useMPTIssuance'),
  useMPTIssuance: jest.fn(),
}))

const renderComponent = createSimpleRenderFactory(Simple)

describe('OfferCreate: Simple', () => {
  beforeEach(() => {
    ;(useMPTIssuance as jest.Mock).mockReturnValue({ data: undefined })
  })

  it('renders with an expiration and offer', () => {
    const { container, unmount } = renderComponent(mockOfferCreateWithCancel)
    expect(
      container.querySelector('[data-testid="amount"] .one-line'),
    ).toHaveTextContent('\uE900 XRP/CSC.rCSC')
    expect(
      container.querySelector('[data-testid="cancel-id"] .value'),
    ).toHaveTextContent('#44866443')
    expect(
      container.querySelector('[data-testid="amount-buy"] .value'),
    ).toHaveTextContent(`\uE9001,764.293151 XRP`)
    expect(
      container.querySelector('[data-testid="amount-sell"] .value'),
    ).toHaveTextContent(`1,080,661.95882 CSC.rCSCManTZ8ME9EoLrSHHYKW8PPwWMgkwr`)
    unmount()
  })

  it('renders', () => {
    const { container } = renderComponent(mockOfferCreate)

    expect(
      container.querySelector('[data-testid="offer-id"] .value'),
    ).not.toBeInTheDocument()
    expect(
      container.querySelector('[data-testid="amount-buy"] .value'),
    ).toHaveTextContent(`\uE90024,755.081083 XRP`)
    expect(
      container.querySelector('[data-testid="amount-sell"] .value'),
    ).toHaveTextContent(`51.41523894 BCH.rcyS4CeCZVYvTiKcxj6Sx32ibKwcDHLds`)
  })

  it(`renders offerCreate with a Permissioned Domain ID`, () => {
    const { container } = renderComponent(
      mockOfferCreateWithPermissionedDomainID,
    )

    expect(
      container.querySelector('[data-testid="domain-id"] .value'),
    ).toHaveTextContent(
      '4A4879496CFF23CA32242D50DA04DDB41F4561167276A62AF21899F83DF28812',
    )
  })

  it('renders OfferCreate with MPT TakerGets and XRP TakerPays (no ticker)', () => {
    ;(useMPTIssuance as jest.Mock).mockReturnValue({
      data: { assetScale: 0 },
    })
    const { container } = renderComponent(mockOfferCreateMPT)
    expect(
      container.querySelector('[data-testid="amount-buy"] .value'),
    ).toHaveTextContent('XRP')
    expect(
      container.querySelector('[data-testid="amount-sell"] .value'),
    ).toHaveTextContent(
      '1,000 000003C31D321B7DDA58324DC38CDF18934FAFFFCDF69D5F',
    )
  })

  it('renders OfferCreate with MPT TakerGets and XRP TakerPays (with ticker)', () => {
    ;(useMPTIssuance as jest.Mock).mockReturnValue({
      data: {
        assetScale: 0,
        parsedMPTMetadata: { ticker: 'XMPT' },
      },
    })
    const { container } = renderComponent(mockOfferCreateMPT)
    expect(
      container.querySelector('[data-testid="amount-buy"] .value'),
    ).toHaveTextContent('XRP')
    expect(
      container.querySelector('[data-testid="amount-sell"] .value'),
    ).toHaveTextContent('1,000 XMPT')
  })

  it('renders OfferCreate with MPT TakerPays and IOU TakerGets (no ticker)', () => {
    ;(useMPTIssuance as jest.Mock).mockReturnValue({
      data: { assetScale: 0 },
    })
    const { container } = renderComponent(mockOfferCreateMPTPayIOU)
    expect(
      container.querySelector('[data-testid="amount-buy"] .value'),
    ).toHaveTextContent(
      '500 000003C31D321B7DDA58324DC38CDF18934FAFFFCDF69D5F',
    )
    expect(
      container.querySelector('[data-testid="amount-sell"] .value'),
    ).toHaveTextContent('100')
  })

  it('renders OfferCreate with MPT TakerPays and IOU TakerGets (with ticker)', () => {
    ;(useMPTIssuance as jest.Mock).mockReturnValue({
      data: {
        assetScale: 0,
        parsedMPTMetadata: { ticker: 'XMPT' },
      },
    })
    const { container } = renderComponent(mockOfferCreateMPTPayIOU)
    expect(
      container.querySelector('[data-testid="amount-buy"] .value'),
    ).toHaveTextContent('500 XMPT')
    expect(
      container.querySelector('[data-testid="amount-sell"] .value'),
    ).toHaveTextContent('100')
  })
})
