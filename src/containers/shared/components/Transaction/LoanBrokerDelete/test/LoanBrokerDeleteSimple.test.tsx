import { createSimpleWrapperFactory, expectSimpleRowText } from '../../test'
import { Simple } from '../Simple'
import LoanBrokerDelete from './mock_data/LoanBrokerDelete.json'

const createWrapper = createSimpleWrapperFactory(Simple)

describe('LoanBrokerDelete: Simple', () => {
  it('renders', () => {
    const wrapper = createWrapper(LoanBrokerDelete)
    expectSimpleRowText(
      wrapper,
      'loan-broker-id',
      '7B3AF305C92293AF3F01088298E354E7B649F963427FA4B7F5414EF1383CB80B',
    )
    wrapper.unmount()
  })
})
