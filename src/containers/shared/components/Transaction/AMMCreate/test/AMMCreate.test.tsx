import { Simple } from '../Simple'
import { createSimpleRenderFactory, expectSimpleRowText } from '../../test'
import createMock from './mock_data/amm_create.json'

describe('AMM Create Tests', () => {
  const renderComponent = createSimpleRenderFactory(Simple)

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
})
