import { createSimpleWrapperFactory, expectSimpleRowText } from '../../test'
import { Simple } from '../Simple'
import LoanPay from './mock_data/LoanPay.json'

const createWrapper = createSimpleWrapperFactory(Simple)

describe('LoanPay: Simple', () => {
  it('renders', () => {
    const wrapper = createWrapper(LoanPay)
    expectSimpleRowText(
      wrapper,
      'loan-id',
      '28375E885D1F8E46502B1A6FA44B9E2EFC15244F467010082BE314AE6224CD66',
    )
    expectSimpleRowText(
      wrapper,
      'amount',
      '$5.00 USD.ra8dG1xwi5dQTJx1fRNCc8gjSAdQMX3vV7',
    )
    wrapper.unmount()
  })
})
