import { Simple } from '../../AMMSharedSimple'
import { createSimpleWrapperFactory, expectSimpleRowText } from '../../../test'
import withdrawMock from './mock_data/withdraw.json'

describe('AMM Withdraw Tests', () => {
  const createWrapper = createSimpleWrapperFactory(Simple)

  it('renders from transaction', () => {
    const wrapper = createWrapper(withdrawMock)
    expectSimpleRowText(wrapper, 'asset1', '\uE9003,666.580882 XRP')
    expectSimpleRowText(
      wrapper,
      'asset2',
      '$4,000.00 USD.rhpHaFggC92ELty3n3yDEtuFgWxXWkUFET',
    )
    expectSimpleRowText(
      wrapper,
      'account_id',
      'rMEdVzU8mtEArzjrN9avm3kA675GX7ez8W',
    )
    wrapper.unmount()
  })
})
