import { useQuery } from 'react-query'
import { createSimpleWrapperFactory, expectSimpleRowText } from '../../test'
import { Simple } from '../Simple'
import LoanBrokerCoverClawback from './mock_data/LoanBrokerCoverClawback.json'
import LoanBrokerCoverClawbackZeroAmount from './mock_data/LoanBrokerCoverClawbackZeroAmount.json'
import LoanBrokerCoverClawbackNoAmount from './mock_data/LoanBrokerCoverClawbackNoAmount.json'
import LoanBrokerCoverClawbackMPT from './mock_data/LoanBrokerCoverClawbackMPT.json'

jest.mock('react-query', () => ({
  ...jest.requireActual('react-query'),
  useQuery: jest.fn(),
}))

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

  it('renders with calculated MPT amount when Amount is undefined', () => {
    ;(useQuery as jest.Mock).mockImplementation(() => ({
      data: {
        assetScale: 2,
      },
    }))

    const wrapper = createWrapper(LoanBrokerCoverClawbackMPT)
    expectSimpleRowText(
      wrapper,
      'loan-broker-id',
      '358A255D294C9F5653686E90640F7EA922CBB26149EDD0AF8A02569BFC9412DC',
    )
    expectSimpleRowText(
      wrapper,
      'amount',
      '4.94 MPT (0004E8D60726C960436D88F20FFC2A873665CE675789E255)',
    )
    wrapper.unmount()
  })
})
