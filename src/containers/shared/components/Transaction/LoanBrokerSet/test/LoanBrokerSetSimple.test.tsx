import { useQuery } from 'react-query'
import { createSimpleWrapperFactory, expectSimpleRowText } from '../../test'
import i18n from '../../../../../../i18n/testConfigEnglish'
import { Simple } from '../Simple'
import LoanBrokerSet from './mock_data/LoanBrokerSet.json'
import LoanBrokerSetZeroDebt from './mock_data/LoanBrokerSetZeroDebt.json'

jest.mock('react-query', () => ({
  ...jest.requireActual('react-query'),
  useQuery: jest.fn(),
}))

const createWrapper = createSimpleWrapperFactory(Simple, i18n)

describe('LoanBrokerSet: Simple', () => {
  it('renders', () => {
    // Mock useQuery to return the vault asset information
    ;(useQuery as jest.Mock).mockReturnValue({
      data: { currency: 'USD', issuer: 'ra8dG1xwi5dQTJx1fRNCc8gjSAdQMX3vV7' },
      isLoading: false,
      error: null,
    })

    const wrapper = createWrapper(LoanBrokerSet)
    expectSimpleRowText(
      wrapper,
      'vault-id',
      'AE7952AFEE76456A1ECA877E1797E9FF842E7FD87D1F2C856B7B1EE10C9654D7',
    )
    expectSimpleRowText(wrapper, 'management-fee-rate', '1.00%')

    expectSimpleRowText(
      wrapper,
      'debt-maximum',
      '$100,000,000,000.00 USD.ra8dG1xwi5dQTJx1fRNCc8gjSAdQMX3vV7',
    )
    expectSimpleRowText(wrapper, 'cover-rate-minimum', '1.00%')
    expectSimpleRowText(wrapper, 'cover-rate-liquidation', '5.00%')
    expectSimpleRowText(wrapper, 'data', '{meta: "LoanBroker Metadata"}')
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
    expectSimpleRowText(
      wrapper,
      'vault-id',
      'AE7952AFEE76456A1ECA877E1797E9FF842E7FD87D1F2C856B7B1EE10C9654D7',
    )
    expectSimpleRowText(wrapper, 'management-fee-rate', '1.00%')
    expectSimpleRowText(wrapper, 'debt-maximum', 'No Limit')
    expectSimpleRowText(wrapper, 'cover-rate-minimum', '1.00%')
    expectSimpleRowText(wrapper, 'cover-rate-liquidation', '5.00%')
    expectSimpleRowText(wrapper, 'data', '{meta: "LoanBroker Metadata"}')
    wrapper.unmount()
  })
})
