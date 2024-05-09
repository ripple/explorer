import { cleanup, screen } from '@testing-library/react'
import { Simple } from '../Simple'
import { createSimpleRenderFactory, expectSimpleRowText } from '../../test'
import voteMock from './mock_data/amm_vote.json'

describe('AMM Vote Tests', () => {
  const renderComponent = createSimpleRenderFactory(Simple)

  it('renders from transaction', () => {
    renderComponent(voteMock)
    expectSimpleRowText(screen, 'trading_fee', '0.001%')
    expectSimpleRowText(
      screen,
      'account_id',
      'rMEdVzU8mtEArzjrN9avm3kA675GX7ez8W',
    )
  })
})
