import { useQuery } from 'react-query'
import { createTableDetailRenderFactory } from '../../test'
import { TableDetail } from '../TableDetail'
import i18n from '../../../../../../i18n/testConfigEnglish'
import LoanSet from './mock_data/LoanSet.json'

jest.mock('react-query', () => ({
  ...jest.requireActual('react-query'),
  useQuery: jest.fn(),
}))

const renderComponent = createTableDetailRenderFactory(TableDetail, i18n)

describe('LoanSetTableDetail', () => {
  it('renders with all loan details', () => {
    // Mock useQuery to return the vault asset information
    ;(useQuery as jest.Mock).mockReturnValue({
      data: { currency: 'USD', issuer: 'ra8dG1xwi5dQTJx1fRNCc8gjSAdQMX3vV7' },
      isLoading: false,
      error: null,
    })

    const { container, unmount } = renderComponent(LoanSet)

    expect(container.querySelector('.loan-set')).toHaveTextContent(
      'Loan Broker ID: 7B3AF3...3CB80BRequest: $10.00 USD.ra8dG1xwi5dQTJx1fRNCc8gjSAdQMX3vV7 from rH4absn9JcB8m943YRMNJpuR9HQs56hkr8Rates: Interest Rate 0.500%, Late Interest Rate 1.000%, Overpayment Fee 0.500%Fees: Loan Origination Fee $1.00 USD.ra8dG1xwi5dQTJx1fRNCc8gjSAdQMX3vV7, Loan Service Fee $0.10 USD.ra8dG1xwi5dQTJx1fRNCc8gjSAdQMX3vV7Terms: 12 Payment Total, Payment Interval 30d, Grace Period 7d',
    )

    unmount()
  })
})
