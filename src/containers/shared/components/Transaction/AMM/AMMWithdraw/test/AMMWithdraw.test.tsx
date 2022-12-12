import { Simple } from 'containers/shared/components/Transaction/AMM/AMMSharedSimple'
import { createSimpleWrapperFactory } from '../../../test'
import withdrawMock from './mock_data/withdraw.json'

describe('AMM Withdraw Tests', () => {
  const createWrapper = createSimpleWrapperFactory(Simple)

  it('renders from transaction', () => {
    const wrapper = createWrapper(withdrawMock)
    expect(wrapper.find('[label="asset1"] .value')).toHaveText(
      `\uE9003,666.580882 XRP`,
    )
    expect(wrapper.find('[label="asset2"] .value')).toHaveText(
      `$4,000.00 USD.rhpHaFggC92ELty3n3yDEtuFgWxXWkUFET`,
    )
    expect(wrapper.find('[label="account_id"] .value')).toHaveText(
      'rMEdVzU8mtEArzjrN9avm3kA675GX7ez8W',
    )
    wrapper.unmount()
  })
})
