import { Simple } from 'containers/shared/components/Transaction/AMM/AMMSharedSimple'
import { createSimpleWrapperFactory } from '../../../test'
import bidMock from './mock_data/amm_bid.json'

describe('AMM Bid Tests', () => {
  const createWrapper = createSimpleWrapperFactory(Simple)

  it('renders from transaction', () => {
    const wrapper = createWrapper(bidMock)
    expect(wrapper.find('[label="min_slot_price"] .value')).toHaveText(`LP 100`)
    expect(wrapper.find('[label="account_id"] .value')).toHaveText(
      'rMEdVzU8mtEArzjrN9avm3kA675GX7ez8W',
    )
    wrapper.unmount()
  })
})
