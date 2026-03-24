import { Simple } from '../Simple'
import { createSimpleRenderFactory, expectSimpleRowText } from '../../test'
import createMock from './mock_data/amm_create.json'
import createMockMpt from './mock_data/amm_create_mpt.json'
import createMockBothMpt from './mock_data/amm_create_both_mpt.json'
import { useMPTIssuance } from '../../../../hooks/useMPTIssuance'

jest.mock('../../../../hooks/useMPTIssuance', () => ({
  ...jest.requireActual('../../../../hooks/useMPTIssuance'),
  useMPTIssuance: jest.fn(),
}))

describe('AMM Create Tests', () => {
  const renderComponent = createSimpleRenderFactory(Simple)

  beforeEach(() => {
    ;(useMPTIssuance as jest.Mock).mockReturnValue({ data: undefined })
  })

  it('renders from transaction', () => {
    const { container, unmount } = renderComponent(createMock)
    expectSimpleRowText(container, 'asset1', '\uE90010,000.00 XRP')
    expectSimpleRowText(container, 'trading_fee', '0.001%')
    expectSimpleRowText(
      container,
      'asset2',
      '$10,000.00 USD.rhpHaFggC92ELty3n3yDEtuFgWxXWkUFET',
    )
    expectSimpleRowText(
      container,
      'account_id',
      'rMEdVzU8mtEArzjrN9avm3kA675GX7ez8W',
    )
    unmount()
  })

  it('renders AMMCreate with XRP + MPT pair (no ticker)', () => {
    ;(useMPTIssuance as jest.Mock).mockReturnValue({
      data: { assetScale: 0 },
    })
    const { container, unmount } = renderComponent(createMockMpt)
    expectSimpleRowText(container, 'asset1', '\uE90010,000.00 XRP')
    expectSimpleRowText(
      container,
      'asset2',
      '10,000 000003C31D321B7DDA58324DC38CDF18934FAFFFCDF69D5F',
    )
    unmount()
  })

  it('renders AMMCreate with XRP + MPT pair (with ticker)', () => {
    ;(useMPTIssuance as jest.Mock).mockReturnValue({
      data: { assetScale: 0, parsedMPTMetadata: { ticker: 'XGLD' } },
    })
    const { container, unmount } = renderComponent(createMockMpt)
    expectSimpleRowText(container, 'asset1', '\uE90010,000.00 XRP')
    expectSimpleRowText(container, 'asset2', '10,000 XGLD')
    unmount()
  })

  it('renders AMMCreate with both MPT assets (no ticker)', () => {
    ;(useMPTIssuance as jest.Mock).mockReturnValue({
      data: { assetScale: 0 },
    })
    const { container, unmount } = renderComponent(createMockBothMpt)
    expectSimpleRowText(
      container,
      'asset1',
      '5,000 000003C31D321B7DDA58324DC38CDF18934FAFFFCDF69D5F',
    )
    expectSimpleRowText(
      container,
      'asset2',
      '2,000 00000ABC2E631B9DFA58324DC38CDF18934FAFFFCDF69D5F',
    )
    unmount()
  })

  it('renders AMMCreate with both MPT assets (with ticker)', () => {
    ;(useMPTIssuance as jest.Mock).mockImplementation((mptID: string) => {
      if (mptID === '000003C31D321B7DDA58324DC38CDF18934FAFFFCDF69D5F') {
        return {
          data: { assetScale: 0, parsedMPTMetadata: { ticker: 'XGLD' } },
        }
      }
      return {
        data: { assetScale: 0, parsedMPTMetadata: { ticker: 'XUSD' } },
      }
    })
    const { container, unmount } = renderComponent(createMockBothMpt)
    expectSimpleRowText(container, 'asset1', '5,000 XGLD')
    expectSimpleRowText(container, 'asset2', '2,000 XUSD')
    unmount()
  })
})
