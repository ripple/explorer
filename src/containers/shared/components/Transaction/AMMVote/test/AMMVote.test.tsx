import { Simple } from '../Simple'
import { createSimpleRenderFactory, expectSimpleRowText } from '../../test'
import voteMock from './mock_data/amm_vote.json'

describe('AMM Vote Tests', () => {
  const createWrapper = createSimpleRenderFactory(Simple)

  it('renders from transaction', () => {
    const wrapper = createWrapper(voteMock)
    expectSimpleRowText(wrapper, 'trading_fee', '0.001%')
    expectSimpleRowText(
      wrapper,
      'account_id',
      'rMEdVzU8mtEArzjrN9avm3kA675GX7ez8W',
    )
    wrapper.unmount()
  })
})
