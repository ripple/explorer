import { Simple } from '../../AMMSharedSimple'
import { createSimpleWrapperFactory, expectSimpleRowText } from '../../../test'
import depositBothAssets from './mock_data/deposit_both.json'
import depositUSD from './mock_data/deposit_usd.json'
import depositXRP from './mock_data/deposit_xrp.json'

describe('AMM Deposit Tests', () => {
  const createWrapper = createSimpleWrapperFactory(Simple)

  it('renders with both assets', () => {
    const wrapper = createWrapper(depositBothAssets)
    expectSimpleRowText(wrapper, 'asset1', '\uE90010,997.290462 XRP')
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

  it('renders only with USD', () => {
    const wrapper = createWrapper(depositUSD)
    expectSimpleRowText(
      wrapper,
      'asset2',
      '$2,000.00 USD.rhpHaFggC92ELty3n3yDEtuFgWxXWkUFET',
    )
    expectSimpleRowText(
      wrapper,
      'account_id',
      'rMEdVzU8mtEArzjrN9avm3kA675GX7ez8W',
    )
    wrapper.unmount()
  })

  it('renders only with XRP', () => {
    const wrapper = createWrapper(depositXRP)
    expectSimpleRowText(wrapper, 'asset1', '\uE9001,000.00 XRP')
    expectSimpleRowText(
      wrapper,
      'account_id',
      'rMEdVzU8mtEArzjrN9avm3kA675GX7ez8W',
    )
    wrapper.unmount()
  })
})
