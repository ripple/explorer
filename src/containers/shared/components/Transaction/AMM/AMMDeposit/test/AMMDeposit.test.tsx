import { Simple } from 'containers/shared/components/Transaction/AMM/AMMSharedSimple'
import { createSimpleWrapperFactory } from '../../../test'
import depositBothAssets from './mock_data/deposit_both.json'
import depositUSD from './mock_data/deposit_usd.json'
import depositXRP from './mock_data/deposit_xrp.json'

describe('AMM Deposit Tests', () => {
  const createWrapper = createSimpleWrapperFactory(Simple)

  it('renders with both assets', () => {
    const wrapper = createWrapper(depositBothAssets)
    expect(wrapper.find('[label="asset1"] .value')).toHaveText(
      `\uE90010,997.290462 XRP`,
    )
    expect(wrapper.find('[label="asset2"] .value')).toHaveText(
      `$10,000.00 USD.rhpHaFggC92ELty3n3yDEtuFgWxXWkUFET`,
    )
    expect(wrapper.find('[label="account_id"] .value')).toHaveText(
      'rMEdVzU8mtEArzjrN9avm3kA675GX7ez8W',
    )
    wrapper.unmount()
  })

  it('renders only with USD', () => {
    const wrapper = createWrapper(depositUSD)
    expect(wrapper.find('[label="asset2"] .value')).toHaveText(
      `$2,000.00 USD.rhpHaFggC92ELty3n3yDEtuFgWxXWkUFET`,
    )
    expect(wrapper.find('[label="account_id"] .value')).toHaveText(
      'rMEdVzU8mtEArzjrN9avm3kA675GX7ez8W',
    )
    wrapper.unmount()
  })

  it('renders only with XRP', () => {
    const wrapper = createWrapper(depositXRP)
    expect(wrapper.find('[label="asset1"] .value')).toHaveText(
      `\uE9001,000.00 XRP`,
    )
    expect(wrapper.find('[label="account_id"] .value')).toHaveText(
      'rMEdVzU8mtEArzjrN9avm3kA675GX7ez8W',
    )
    wrapper.unmount()
  })
})
