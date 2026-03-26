import { Simple } from '../Simple'
import { createSimpleRenderFactory, expectSimpleRowText } from '../../test'
import bidMock from './mock_data/amm_bid.json'

describe('AMM Bid Tests', () => {
  const renderComponent = createSimpleRenderFactory(Simple)

  it('renders from transaction', () => {
    const { container, unmount } = renderComponent(bidMock)
    expectSimpleRowText(
      container,
      'min_slot_price',
      '100.00 LP.rMEdVzU8mtEArzjrN9avm3kA675GX7ez8W',
    )
    expectSimpleRowText(
      container,
      'max_slot_price',
      '500.00 LP.rMEdVzU8mtEArzjrN9avm3kA675GX7ez8W',
    )
    expectSimpleRowText(
      container,
      'account_id',
      'rMEdVzU8mtEArzjrN9avm3kA675GX7ez8W',
    )
    expectSimpleRowText(
      container,
      'auth_accounts',
      'ra8uHq2Qme5j19TqvPzTE2nqT12Zc3xJmKrU6o2YguZi847RaiH2QGTkL4eZWZjbxZvk',
    )
    unmount()
  })
})
