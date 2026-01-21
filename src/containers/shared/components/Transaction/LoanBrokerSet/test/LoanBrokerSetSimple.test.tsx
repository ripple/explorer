import { useQuery } from 'react-query'
import { createSimpleRenderFactory, expectSimpleRowText } from '../../test'
import i18n from '../../../../../../i18n/testConfigEnglish'
import { Simple } from '../Simple'
import LoanBrokerSet from './mock_data/LoanBrokerSet.json'
import LoanBrokerSetZeroDebt from './mock_data/LoanBrokerSetZeroDebt.json'
import LoanBrokerSetPartialUpdate from './mock_data/LoanBrokerSetPartialUpdate.json'

jest.mock('react-query', () => ({
  ...jest.requireActual('react-query'),
  useQuery: jest.fn(),
}))

const renderComponent = createSimpleRenderFactory(Simple, i18n)

describe('LoanBrokerSet: Simple', () => {
  it('renders', () => {
    // Mock useQuery to return the vault asset information
    ;(useQuery as jest.Mock).mockReturnValue({
      data: { currency: 'USD', issuer: 'ra8dG1xwi5dQTJx1fRNCc8gjSAdQMX3vV7' },
      isLoading: false,
      error: null,
    })

    const { container, unmount } = renderComponent(LoanBrokerSet)
    expectSimpleRowText(
      container,
      'vault-id',
      'AE7952AFEE76456A1ECA877E1797E9FF842E7FD87D1F2C856B7B1EE10C9654D7',
    )
    expectSimpleRowText(container, 'management-fee-rate', '1.000%')

    expectSimpleRowText(
      container,
      'debt-maximum',
      '$100,000.00 USD.ra8dG1xwi5dQTJx1fRNCc8gjSAdQMX3vV7',
    )
    expectSimpleRowText(container, 'cover-rate-minimum', '1.000%')
    expectSimpleRowText(container, 'cover-rate-liquidation', '5.000%')
    expectSimpleRowText(container, 'data', '{meta: "LoanBroker Metadata"}')
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
    expectSimpleRowText(
      container,
      'vault-id',
      'AE7952AFEE76456A1ECA877E1797E9FF842E7FD87D1F2C856B7B1EE10C9654D7',
    )
    expectSimpleRowText(container, 'management-fee-rate', '1.000%')
    expectSimpleRowText(container, 'debt-maximum', 'No Limit')
    expectSimpleRowText(container, 'cover-rate-minimum', '1.000%')
    expectSimpleRowText(container, 'cover-rate-liquidation', '5.000%')
    expectSimpleRowText(container, 'data', '{meta: "LoanBroker Metadata"}')
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
    expectSimpleRowText(
      container,
      'vault-id',
      'AE7952AFEE76456A1ECA877E1797E9FF842E7FD87D1F2C856B7B1EE10C9654D7',
    )
    expectSimpleRowText(container, 'management-fee-rate', '1.000%')
    expectSimpleRowText(container, 'cover-rate-minimum', '1.000%')
    expectSimpleRowText(container, 'cover-rate-liquidation', '5.000%')
    expectSimpleRowText(container, 'data', '{meta: "LoanBroker Metadata"}')

    // DebtMaximum should not be shown since it was omitted from the transaction
    expect(
      container.querySelector('[data-testid="debt-maximum"]'),
    ).not.toBeInTheDocument()

    unmount()
  })
})
