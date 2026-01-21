import { Simple } from '../Simple'
import { createSimpleRenderFactory, expectSimpleRowText } from '../../test'
import voteMock from './mock_data/amm_vote.json'

describe('AMM Vote Tests', () => {
  const renderComponent = createSimpleRenderFactory(Simple)

  it('renders from transaction', () => {
    const { container, unmount } = renderComponent(voteMock)
    expectSimpleRowText(container, 'trading_fee', '0.001%')
    expectSimpleRowText(
      container,
      'account_id',
      'rMEdVzU8mtEArzjrN9avm3kA675GX7ez8W',
    )
    unmount()
  })
})
