import { Simple } from 'containers/shared/components/Transaction/AMM/AMMSharedSimple'
import { createSimpleWrapperFactory } from '../../../test'
import createMock from './mock_data/amm_create.json'

describe('AMM Create Tests', () => {
  const createWrapper = createSimpleWrapperFactory(Simple)

  it('renders from transaction', () => {
    const wrapper = createWrapper(createMock)
    expect(wrapper.find('[label="asset1"] .value')).toHaveText(
      `\uE90010,000.00 XRP`,
    )
    expect(wrapper.find('[label="asset2"] .value')).toHaveText(
      `$10,000.00 USD.rhpHaFggC92ELty3n3yDEtuFgWxXWkUFET`,
    )
    expect(wrapper.find('[label="account_id"] .value')).toHaveText(
      'rMEdVzU8mtEArzjrN9avm3kA675GX7ez8W',
    )
    wrapper.unmount()
  })
})
