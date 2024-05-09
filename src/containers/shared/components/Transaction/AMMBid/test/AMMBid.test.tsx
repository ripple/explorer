import { Simple } from '../Simple'
import { createSimpleRenderFactory, expectSimpleRowText } from '../../test'
import bidMock from './mock_data/amm_bid.json'

describe('AMM Bid Tests', () => {
  const createWrapper = createSimpleRenderFactory(Simple)

  it('renders from transaction', () => {
    const wrapper = createWrapper(bidMock)
    expectSimpleRowText(
      wrapper,
      'min_slot_price',
      '100.00 LP.rMEdVzU8mtEArzjrN9avm3kA675GX7ez8W',
    )
    expectSimpleRowText(
      wrapper,
      'max_slot_price',
      '500.00 LP.rMEdVzU8mtEArzjrN9avm3kA675GX7ez8W',
    )
    expectSimpleRowText(
      wrapper,
      'account_id',
      'rMEdVzU8mtEArzjrN9avm3kA675GX7ez8W',
    )
    expectSimpleRowText(
      wrapper,
      'auth_accounts',
      'ra8uHq2Qme5j19TqvPzTE2nqT12Zc3xJmKrU6o2YguZi847RaiH2QGTkL4eZWZjbxZvk',
    )
    wrapper.unmount()
  })
})
