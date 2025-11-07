import { createSimpleWrapperFactory, expectSimpleRowText } from '../../test'
import { Simple } from '../Simple'
import LoanBrokerCoverClawback from './mock_data/LoanBrokerCoverClawback.json'

const createWrapper = createSimpleWrapperFactory(Simple)

describe('LoanBrokerCoverClawback: Simple', () => {
  it('renders', () => {
    const wrapper = createWrapper(LoanBrokerCoverClawback)
    expectSimpleRowText(
      wrapper,
      'loan-broker-id',
      '7B3AF305C92293AF3F01088298E354E7B649F963427FA4B7F5414EF1383CB80B',
    )
    expectSimpleRowText(
      wrapper,
      'amount',
      '$5.00 USD.ra8dG1xwi5dQTJx1fRNCc8gjSAdQMX3vV7',
    )
    wrapper.unmount()
  })
})
