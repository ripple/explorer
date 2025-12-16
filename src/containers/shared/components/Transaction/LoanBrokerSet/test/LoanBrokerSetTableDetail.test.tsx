import { useQuery } from 'react-query'
import i18n from '../../../../../../i18n/testConfigEnglish'
import { createTableDetailWrapperFactory } from '../../test'
import { TableDetail } from '../TableDetail'
import LoanBrokerSet from './mock_data/LoanBrokerSet.json'
import LoanBrokerSetPartialUpdate from './mock_data/LoanBrokerSetPartialUpdate.json'
import LoanBrokerSetZeroDebt from './mock_data/LoanBrokerSetZeroDebt.json'

jest.mock('react-query', () => ({
  ...jest.requireActual('react-query'),
  useQuery: jest.fn(),
}))

const createWrapper = createTableDetailWrapperFactory(TableDetail, i18n)

describe('LoanBrokerSetTableDetail', () => {
  it('renders with non-zero debt maximum', () => {
    // Mock useQuery to return the vault asset information
    ;(useQuery as jest.Mock).mockReturnValue({
      data: { currency: 'USD', issuer: 'ra8dG1xwi5dQTJx1fRNCc8gjSAdQMX3vV7' },
      isLoading: false,
      error: null,
    })

    const wrapper = createWrapper(LoanBrokerSet)

    expect(wrapper.find('.loan-broker-set')).toHaveText(
      'Vault ID: AE7952AFEE76456A1ECA877E1797E9FF842E7FD87D1F2C856B7B1EE10C9654D7' +
        'rates: Management Fee Rate 1.000%, Cover Rate Minimum 1.000%, Cover Rate Liquidation 5.000%' +
        'Debt Maximum: $100,000.00 USD.ra8dG1xwi5dQTJx1fRNCc8gjSAdQMX3vV7',
    )

    wrapper.unmount()
  })

  it('renders with zero debt maximum showing No Limit', () => {
    // Mock useQuery to return the vault asset information
    ;(useQuery as jest.Mock).mockReturnValue({
      data: { currency: 'USD', issuer: 'ra8dG1xwi5dQTJx1fRNCc8gjSAdQMX3vV7' },
      isLoading: false,
      error: null,
    })

    const wrapper = createWrapper(LoanBrokerSetZeroDebt)

    expect(wrapper.find('.debt-maximum')).toHaveText('Debt Maximum: No Limit')

    wrapper.unmount()
  })

  it('renders partial update without showing omitted DebtMaximum field', () => {
    // Mock useQuery to return the vault asset information
    ;(useQuery as jest.Mock).mockReturnValue({
      data: { currency: 'USD', issuer: 'ra8dG1xwi5dQTJx1fRNCc8gjSAdQMX3vV7' },
      isLoading: false,
      error: null,
    })

    const wrapper = createWrapper(LoanBrokerSetPartialUpdate)

    expect(wrapper.find('.loan-broker-set')).toHaveText(
      'Vault ID: AE7952AFEE76456A1ECA877E1797E9FF842E7FD87D1F2C856B7B1EE10C9654D7' +
        'rates: Management Fee Rate 1.000%, Cover Rate Minimum 1.000%, Cover Rate Liquidation 5.000%',
    )

    // DebtMaximum should not be shown since it was omitted from the transaction
    expect(wrapper.find('.debt-maximum')).toHaveLength(0)

    wrapper.unmount()
  })
})
