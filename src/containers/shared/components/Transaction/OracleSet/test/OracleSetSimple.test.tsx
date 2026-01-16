import { createSimpleRenderFactory, expectSimpleRowText } from '../../test'
import { Simple } from '../Simple'
import OracleSet from './mock_data/OracleSet.json'

const renderComponent = createSimpleRenderFactory(Simple)
describe('OracleSet: Simple', () => {
  it('renders', () => {
    const { container, unmount } = renderComponent(OracleSet)
    expectSimpleRowText(container, 'oracle-document-id', '1')
    expectSimpleRowText(container, 'provider', 'provider')
    expectSimpleRowText(
      container,
      'last-update-time',
      'May 13, 2024 at 9:05:10 PM',
    )
    expectSimpleRowText(container, 'asset-class', 'currency')
    expectSimpleRowText(
      container,
      'trading-pairs',
      '74.2\uE900 XRP/USD1.03BTC/AUDT',
    )
    unmount()
  })
})
