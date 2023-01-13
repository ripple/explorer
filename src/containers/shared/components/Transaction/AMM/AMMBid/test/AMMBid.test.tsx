import { Simple } from '../../AMMSharedSimple'
import { createSimpleWrapperFactory, expectSimpleRowText } from '../../../test'
import bidMock from './mock_data/amm_bid.json'

describe('AMM Bid Tests', () => {
  const createWrapper = createSimpleWrapperFactory(Simple)

  it('renders from transaction', () => {
    const wrapper = createWrapper(bidMock)
    expectSimpleRowText(wrapper, 'min_slot_price', 'LP 100')
    expectSimpleRowText(wrapper, 'max_slot_price', 'LP 500')
    expectSimpleRowText(
      wrapper,
      'account_id',
      'rMEdVzU8mtEArzjrN9avm3kA675GX7ez8W',
    )
    expect(wrapper.find('[label="min_slot_price"] .value')).toHaveText(`LP 100`)
    expect(wrapper.find('[label="max_slot_price"] .value')).toHaveText(`LP 500`)
    expect(wrapper.find('[label="account_id"] .value')).toHaveText(
      'rMEdVzU8mtEArzjrN9avm3kA675GX7ez8W',
    )
    wrapper.unmount()
  })
})
