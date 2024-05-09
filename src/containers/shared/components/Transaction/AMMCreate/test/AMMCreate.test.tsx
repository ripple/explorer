import { Simple } from '../Simple'
import { createSimpleRenderFactory, expectSimpleRowText } from '../../test'
import createMock from './mock_data/amm_create.json'

describe('AMM Create Tests', () => {
  const createWrapper = createSimpleRenderFactory(Simple)

  it('renders from transaction', () => {
    const wrapper = createWrapper(createMock)
    expectSimpleRowText(wrapper, 'asset1', '\uE90010,000.00 XRP')
    expectSimpleRowText(wrapper, 'trading_fee', '0.001%')
    expectSimpleRowText(
      wrapper,
      'asset2',
      '$10,000.00 USD.rhpHaFggC92ELty3n3yDEtuFgWxXWkUFET',
    )
    expectSimpleRowText(
      wrapper,
      'account_id',
      'rMEdVzU8mtEArzjrN9avm3kA675GX7ez8W',
    )
    wrapper.unmount()
  })
})
