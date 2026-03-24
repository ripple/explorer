import { useQuery } from 'react-query'
import { Simple } from '../Simple'
import { createSimpleRenderFactory, expectSimpleRowText } from '../../test'
import createMock from './mock_data/amm_create.json'
import createMockMpt from './mock_data/amm_create_mpt.json'

jest.mock('react-query', () => ({
  ...jest.requireActual('react-query'),
  useQuery: jest.fn(),
}))

describe('AMM Create Tests', () => {
  const renderComponent = createSimpleRenderFactory(Simple)

  beforeEach(() => {
    // @ts-ignore
    useQuery.mockImplementation((args: any, fn: any, opts: any) => {
      if (opts?.enabled === false || !opts?.enabled) {
        return { data: undefined }
      }
      return { data: { assetScale: 0 } }
    })
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

  it('renders AMMCreate with XRP + MPT pair', () => {
    // @ts-ignore
    useQuery.mockImplementation(() => ({
      data: { assetScale: 0 },
    }))
    const { container, unmount } = renderComponent(createMockMpt)
    expectSimpleRowText(container, 'asset1', '\uE90010,000.00 XRP')
    // asset2 should contain MPT amount value
    const asset2 = container.querySelector('[data-testid="asset2"] .value')
    expect(asset2).toHaveTextContent('10,000')
    unmount()
  })
})
