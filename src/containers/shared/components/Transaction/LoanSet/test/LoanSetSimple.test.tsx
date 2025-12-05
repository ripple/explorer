import { useQuery } from 'react-query'
import { createSimpleWrapperFactory, expectSimpleRowText } from '../../test'
import { Simple } from '../Simple'
import LoanSet from './mock_data/LoanSet.json'

jest.mock('react-query', () => ({
  ...jest.requireActual('react-query'),
  useQuery: jest.fn(),
}))

const createWrapper = createSimpleWrapperFactory(Simple)

describe('LoanSet: Simple', () => {
  it('renders', () => {
    // Mock useQuery to return the vault asset information
    ;(useQuery as jest.Mock).mockReturnValue({
      data: { currency: 'USD', issuer: 'ra8dG1xwi5dQTJx1fRNCc8gjSAdQMX3vV7' },
      isLoading: false,
      error: null,
    })

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
    expectSimpleRowText(
      wrapper,
      'principal-requested',
      '$10.00 USD.ra8dG1xwi5dQTJx1fRNCc8gjSAdQMX3vV7',
    )
    expectSimpleRowText(wrapper, 'payment-total', '12')
    expectSimpleRowText(wrapper, 'payment-interval', '30d')
    expectSimpleRowText(wrapper, 'grace-period', '7d')
    expectSimpleRowText(
      wrapper,
      'loan-origination-fee',
      '$1.00 USD.ra8dG1xwi5dQTJx1fRNCc8gjSAdQMX3vV7',
    )
    expectSimpleRowText(
      wrapper,
      'loan-service-fee',
      '$0.10 USD.ra8dG1xwi5dQTJx1fRNCc8gjSAdQMX3vV7',
    )
    expectSimpleRowText(
      wrapper,
      'late-payment-fee',
      '$0.50 USD.ra8dG1xwi5dQTJx1fRNCc8gjSAdQMX3vV7',
    )
    expectSimpleRowText(
      wrapper,
      'close-payment-fee',
      '$1.00 USD.ra8dG1xwi5dQTJx1fRNCc8gjSAdQMX3vV7',
    )
    expectSimpleRowText(wrapper, 'overpayment-fee', '0.50%')
    expectSimpleRowText(wrapper, 'interest-rate', '0.50%')
    expectSimpleRowText(wrapper, 'late-interest-rate', '1.00%')
    expectSimpleRowText(wrapper, 'close-interest-rate', '0.20%')
    expectSimpleRowText(wrapper, 'overpayment-interest-rate', '0.30%')
    expectSimpleRowText(wrapper, 'data', '{meta: "LoanSet Metadata"}')
    wrapper.unmount()
  })
})
