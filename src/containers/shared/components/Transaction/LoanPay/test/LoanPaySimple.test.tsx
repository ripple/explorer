import { createSimpleRenderFactory, expectSimpleRowText } from '../../test'
import { Simple } from '../Simple'
import LoanPay from './mock_data/LoanPay.json'

const renderComponent = createSimpleRenderFactory(Simple)

describe('LoanPay: Simple', () => {
  it('renders', () => {
    const { container, unmount } = renderComponent(LoanPay)
    expectSimpleRowText(
      container,
      'loan-id',
      '28375E885D1F8E46502B1A6FA44B9E2EFC15244F467010082BE314AE6224CD66',
    )
    expectSimpleRowText(
      container,
      'amount',
      '$5.00 USD.ra8dG1xwi5dQTJx1fRNCc8gjSAdQMX3vV7',
    )
    unmount()
  })
})
