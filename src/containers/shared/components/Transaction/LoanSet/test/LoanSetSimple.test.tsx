import { useQuery } from 'react-query'
import { createSimpleRenderFactory, expectSimpleRowText } from '../../test'
import { Simple } from '../Simple'
import LoanSet from './mock_data/LoanSet.json'

jest.mock('react-query', () => ({
  ...jest.requireActual('react-query'),
  useQuery: jest.fn(),
}))

const renderComponent = createSimpleRenderFactory(Simple)

describe('LoanSet: Simple', () => {
  it('renders', () => {
    // Mock useQuery to return the vault asset information
    ;(useQuery as jest.Mock).mockReturnValue({
      data: { currency: 'USD', issuer: 'ra8dG1xwi5dQTJx1fRNCc8gjSAdQMX3vV7' },
      isLoading: false,
      error: null,
    })

    const { container, unmount } = renderComponent(LoanSet)

    expectSimpleRowText(
      container,
      'loan-broker-id',
      '7B3AF305C92293AF3F01088298E354E7B649F963427FA4B7F5414EF1383CB80B',
    )
    expectSimpleRowText(
      container,
      'counterparty',
      'rH4absn9JcB8m943YRMNJpuR9HQs56hkr8',
    )
    expectSimpleRowText(
      container,
      'principal-requested',
      '$10.00 USD.ra8dG1xwi5dQTJx1fRNCc8gjSAdQMX3vV7',
    )
    expectSimpleRowText(container, 'payment-total', '12')
    expectSimpleRowText(container, 'payment-interval', '30d')
    expectSimpleRowText(container, 'grace-period', '7d')
    expectSimpleRowText(
      container,
      'loan-origination-fee',
      '$1.00 USD.ra8dG1xwi5dQTJx1fRNCc8gjSAdQMX3vV7',
    )
    expectSimpleRowText(
      container,
      'loan-service-fee',
      '$0.10 USD.ra8dG1xwi5dQTJx1fRNCc8gjSAdQMX3vV7',
    )
    expectSimpleRowText(
      container,
      'late-payment-fee',
      '$0.50 USD.ra8dG1xwi5dQTJx1fRNCc8gjSAdQMX3vV7',
    )
    expectSimpleRowText(
      container,
      'close-payment-fee',
      '$1.00 USD.ra8dG1xwi5dQTJx1fRNCc8gjSAdQMX3vV7',
    )
    expectSimpleRowText(container, 'overpayment-fee', '0.500%')
    expectSimpleRowText(container, 'interest-rate', '0.500%')
    expectSimpleRowText(container, 'late-interest-rate', '1.000%')
    expectSimpleRowText(container, 'close-interest-rate', '0.200%')
    expectSimpleRowText(container, 'overpayment-interest-rate', '0.003%')
    expectSimpleRowText(container, 'data', '{meta: "LoanSet Metadata"}')
    unmount()
  })
})
