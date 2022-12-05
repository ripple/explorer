import { Simple } from 'containers/shared/components/Transaction/AMM/AMMSharedSimple'
import { createSimpleWrapperFactory } from '../../../test'
import voteMock from './mock_data/amm_vote.json'

describe('AMM Vote Tests', () => {
  const createWrapper = createSimpleWrapperFactory(Simple)

  it('renders from transaction', () => {
    const wrapper = createWrapper(voteMock)
    expect(wrapper.find('[label="trading_fee"] .value')).toHaveText(`%0.001`)
    expect(wrapper.find('[label="account_id"] .value')).toHaveText(
      'rMEdVzU8mtEArzjrN9avm3kA675GX7ez8W',
    )
    wrapper.unmount()
  })
})
