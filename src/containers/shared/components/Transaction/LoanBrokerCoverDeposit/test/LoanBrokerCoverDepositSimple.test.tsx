import { createSimpleRenderFactory, expectSimpleRowText } from '../../test'
import { Simple } from '../Simple'
import LoanBrokerCoverDeposit from './mock_data/LoanBrokerCoverDeposit.json'

const renderComponent = createSimpleRenderFactory(Simple)

describe('LoanBrokerCoverDeposit: Simple', () => {
  it('renders', () => {
    const { container, unmount } = renderComponent(LoanBrokerCoverDeposit)
    expectSimpleRowText(
      container,
      'loan-broker-id',
      '7B3AF305C92293AF3F01088298E354E7B649F963427FA4B7F5414EF1383CB80B',
    )
    expectSimpleRowText(
      container,
      'amount',
      '$10.00 USD.ra8dG1xwi5dQTJx1fRNCc8gjSAdQMX3vV7',
    )
    unmount()
  })
})
