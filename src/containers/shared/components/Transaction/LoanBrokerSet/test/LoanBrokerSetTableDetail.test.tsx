import { useQuery } from 'react-query'
import i18n from '../../../../../../i18n/testConfigEnglish'
import { createTableDetailWrapperFactory } from '../../test'
import { TableDetail } from '../TableDetail'
import LoanBrokerSet from './mock_data/LoanBrokerSet.json'
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

    expect(wrapper.find('.debt-maximum')).toHaveText(
      'Debt Maximum: $100,000,000,000.00 USD.ra8dG1xwi5dQTJx1fRNCc8gjSAdQMX3vV7',
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
})
