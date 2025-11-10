import { createSimpleWrapperFactory, expectSimpleRowText } from '../../test'
import { Simple } from '../Simple'
import LoanBrokerCoverClawback from './mock_data/LoanBrokerCoverClawback.json'
import LoanBrokerCoverClawbackZeroAmount from './mock_data/LoanBrokerCoverClawbackZeroAmount.json'
import LoanBrokerCoverClawbackNoAmount from './mock_data/LoanBrokerCoverClawbackNoAmount.json'

const createWrapper = createSimpleWrapperFactory(Simple)

describe('LoanBrokerCoverClawback: Simple', () => {
  it('renders with explicit amount', () => {
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

  it('renders with calculated amount when Amount is 0', () => {
    const wrapper = createWrapper(LoanBrokerCoverClawbackZeroAmount)
    expectSimpleRowText(
      wrapper,
      'loan-broker-id',
      '7B3AF305C92293AF3F01088298E354E7B649F963427FA4B7F5414EF1383CB80B',
    )
    expectSimpleRowText(
      wrapper,
      'amount',
      '$14.95 USD.ra8dG1xwi5dQTJx1fRNCc8gjSAdQMX3vV7',
    )
    wrapper.unmount()
  })

  it('renders with calculated amount when Amount is undefined (real transaction)', () => {
    const wrapper = createWrapper(LoanBrokerCoverClawbackNoAmount)
    expectSimpleRowText(
      wrapper,
      'loan-broker-id',
      '693FCCFB835B322B2714107323EAC727D710DF827030B3935E0A6B62D15B1EEC',
    )
    expectSimpleRowText(
      wrapper,
      'amount',
      '$4.94151169 USD.rh2z5N9avJKVKvWFXyayEMqd7ABqo7Disx',
    )
    wrapper.unmount()
  })
})
