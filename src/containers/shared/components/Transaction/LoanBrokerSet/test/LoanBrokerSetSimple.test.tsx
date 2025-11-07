import { createSimpleWrapperFactory, expectSimpleRowText } from '../../test'
import { Simple } from '../Simple'
import LoanBrokerSet from './mock_data/LoanBrokerSet.json'

const createWrapper = createSimpleWrapperFactory(Simple)

describe('LoanBrokerSet: Simple', () => {
  it('renders', () => {
    const wrapper = createWrapper(LoanBrokerSet)
    expectSimpleRowText(
      wrapper,
      'vault-id',
      'AE7952AFEE76456A1ECA877E1797E9FF842E7FD87D1F2C856B7B1EE10C9654D7',
    )
    expectSimpleRowText(wrapper, 'management-fee-rate', '1.00%')

    expectSimpleRowText(wrapper, 'debt-maximum', '\uE900100,000.00 XRP')
    expectSimpleRowText(wrapper, 'cover-rate-minimum', '1.00%')
    expectSimpleRowText(wrapper, 'cover-rate-liquidation', '5.00%')
    expectSimpleRowText(wrapper, 'data', '{meta: "LoanBroker Metadata"}')
    wrapper.unmount()
  })
})
