import { createSimpleWrapperFactory, expectSimpleRowText } from '../../test'
import { Simple } from '../Simple'
import OracleSet from './mock_data/OracleSet.json'

const createWrapper = createSimpleWrapperFactory(Simple)
describe('OracleSet: Simple', () => {
  it('renders', () => {
    const wrapper = createWrapper(OracleSet)
    expectSimpleRowText(wrapper, 'oracle-document-id', '1')
    expectSimpleRowText(wrapper, 'provider', 'provider')
    expectSimpleRowText(
      wrapper,
      'last-update-time',
      'May 13, 2024 at 9:05:10 PM',
    )
    expectSimpleRowText(wrapper, 'asset-class', 'currency')
    expectSimpleRowText(
      wrapper,
      'trading-pairs',
      '74.2\uE900 XRP/USD1.03BTC/AUDT',
    )
    wrapper.unmount()
  })
})
