import { createSimpleWrapperFactory, expectSimpleRowText } from '../../test'
import { Simple } from '../Simple'
import LoanSet from './mock_data/LoanSet.json'

const createWrapper = createSimpleWrapperFactory(Simple)

describe('LoanSet: Simple', () => {
  it('renders', () => {
    const wrapper = createWrapper(LoanSet)
    expectSimpleRowText(
      wrapper,
      'loan-broker-id',
      '7B3AF305C92293AF3F01088298E354E7B649F963427FA4B7F5414EF1383CB80B',
    )
    expectSimpleRowText(
      wrapper,
      'counterparty',
      'rH4absn9JcB8m943YRMNJpuR9HQs56hkr8',
    )
    expectSimpleRowText(wrapper, 'principal-requested', '\uE9000.00001 XRP')
    expectSimpleRowText(wrapper, 'payment-total', '12')
    expectSimpleRowText(wrapper, 'payment-interval', '30d')
    expectSimpleRowText(wrapper, 'grace-period', '7d')
    expectSimpleRowText(wrapper, 'loan-origination-fee', '\uE9000.000001 XRP')
    expectSimpleRowText(wrapper, 'loan-service-fee', '\uE9000.0000001 XRP')
    expectSimpleRowText(wrapper, 'late-payment-fee', '\uE9000.0000005 XRP')
    expectSimpleRowText(wrapper, 'close-payment-fee', '\uE9000.000001 XRP')
    expectSimpleRowText(wrapper, 'overpayment-fee', '0.50%')
    expectSimpleRowText(wrapper, 'interest-rate', '0.50%')
    expectSimpleRowText(wrapper, 'late-interest-rate', '1.00%')
    expectSimpleRowText(wrapper, 'close-interest-rate', '0.20%')
    expectSimpleRowText(wrapper, 'overpayment-interest-rate', '0.30%')
    expectSimpleRowText(wrapper, 'data', '{meta: "LoanSet Metadata"}')
    wrapper.unmount()
  })
})
