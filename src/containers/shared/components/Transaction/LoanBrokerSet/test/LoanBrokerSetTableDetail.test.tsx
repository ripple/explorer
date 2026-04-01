import { useQuery } from 'react-query'
import i18n from '../../../../../../i18n/testConfigEnglish'
import { createTableDetailRenderFactory } from '../../test'
import { TableDetail } from '../TableDetail'
import LoanBrokerSet from './mock_data/LoanBrokerSet.json'
import LoanBrokerSetPartialUpdate from './mock_data/LoanBrokerSetPartialUpdate.json'
import LoanBrokerSetZeroDebt from './mock_data/LoanBrokerSetZeroDebt.json'

jest.mock('react-query', () => ({
  ...jest.requireActual('react-query'),
  useQuery: jest.fn(),
}))

const renderComponent = createTableDetailRenderFactory(TableDetail, i18n)

describe('LoanBrokerSetTableDetail', () => {
  it('renders with non-zero debt maximum', () => {
    // Mock useQuery to return the vault asset information
    ;(useQuery as jest.Mock).mockReturnValue({
      data: { currency: 'USD', issuer: 'ra8dG1xwi5dQTJx1fRNCc8gjSAdQMX3vV7' },
      isLoading: false,
      error: null,
    })

    const { container, unmount } = renderComponent(LoanBrokerSet)

    expect(container.querySelector('.loan-broker-set')).toHaveTextContent(
      'Vault ID: AE7952AF...9654D7' +
        'rates: Management Fee Rate 1.000%, Cover Rate Minimum 1.000%, Cover Rate Liquidation 5.000%' +
        'Debt Maximum: $100,000.00 USD.ra8dG1xwi5dQTJx1fRNCc8gjSAdQMX3vV7',
    )

    unmount()
  })

  it('renders with zero debt maximum showing No Limit', () => {
    // Mock useQuery to return the vault asset information
    ;(useQuery as jest.Mock).mockReturnValue({
      data: { currency: 'USD', issuer: 'ra8dG1xwi5dQTJx1fRNCc8gjSAdQMX3vV7' },
      isLoading: false,
      error: null,
    })

    const { container, unmount } = renderComponent(LoanBrokerSetZeroDebt)

    expect(container.querySelector('.debt-maximum')).toHaveTextContent(
      'Debt Maximum: No Limit',
    )

    unmount()
  })

  it('renders partial update without showing omitted DebtMaximum field', () => {
    // Mock useQuery to return the vault asset information
    ;(useQuery as jest.Mock).mockReturnValue({
      data: { currency: 'USD', issuer: 'ra8dG1xwi5dQTJx1fRNCc8gjSAdQMX3vV7' },
      isLoading: false,
      error: null,
    })

    const { container, unmount } = renderComponent(LoanBrokerSetPartialUpdate)

    expect(container.querySelector('.loan-broker-set')).toHaveTextContent(
      'Vault ID: AE7952AF...9654D7' +
        'rates: Management Fee Rate 1.000%, Cover Rate Minimum 1.000%, Cover Rate Liquidation 5.000%',
    )

    // DebtMaximum should not be shown since it was omitted from the transaction
    expect(container.querySelector('.debt-maximum')).not.toBeInTheDocument()

    unmount()
  })
})
