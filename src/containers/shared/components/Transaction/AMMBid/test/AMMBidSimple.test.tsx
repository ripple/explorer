import { cleanup, screen } from '@testing-library/react'
import { Simple } from '../Simple'
import { createSimpleRenderFactory, expectSimpleRowText } from '../../test'
import bidMock from './mock_data/amm_bid.json'

const renderComponent = createSimpleRenderFactory(Simple)

describe('AMM Bid: Simple', () => {
  afterEach(cleanup)

  it('renders from transaction', () => {
    renderComponent(bidMock)
    expectSimpleRowText(
      screen,
      'min_slot_price',
      '100.00 LP.rMEdVzU8mtEArzjrN9avm3kA675GX7ez8W',
    )
    expectSimpleRowText(
      screen,
      'max_slot_price',
      '500.00 LP.rMEdVzU8mtEArzjrN9avm3kA675GX7ez8W',
    )
    expectSimpleRowText(
      screen,
      'account_id',
      'rMEdVzU8mtEArzjrN9avm3kA675GX7ez8W',
    )
    expectSimpleRowText(
      screen,
      'auth_accounts',
      'ra8uHq2Qme5j19TqvPzTE2nqT12Zc3xJmKrU6o2YguZi847RaiH2QGTkL4eZWZjbxZvk',
    )
  })
})
