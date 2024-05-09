import { cleanup, screen } from '@testing-library/react'
import { Simple } from '../Simple'
import { createSimpleRenderFactory, expectSimpleRowText } from '../../test'
import createMock from './mock_data/amm_create.json'

const renderComponent = createSimpleRenderFactory(Simple)

describe('AMM Create Tests', () => {
  afterEach(cleanup)

  it('renders from transaction', () => {
    renderComponent(createMock)
    expectSimpleRowText(screen, 'asset1', '\uE90010,000.00 XRP')
    expectSimpleRowText(screen, 'trading_fee', '0.001%')
    expectSimpleRowText(
      screen,
      'asset2',
      '$10,000.00 USD.rhpHaFggC92ELty3n3yDEtuFgWxXWkUFET',
    )
    expectSimpleRowText(
      screen,
      'account_id',
      'rMEdVzU8mtEArzjrN9avm3kA675GX7ez8W',
    )
  })
})
