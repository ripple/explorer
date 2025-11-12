import i18n from '../../../../../../i18n/testConfigEnglish'
import { createTableDetailWrapperFactory } from '../../test'
import { TableDetail } from '../TableDetail'
import LoanBrokerSet from './mock_data/LoanBrokerSet.json'
import LoanBrokerSetZeroDebt from './mock_data/LoanBrokerSetZeroDebt.json'

const createWrapper = createTableDetailWrapperFactory(TableDetail, i18n)

describe('LoanBrokerSetTableDetail', () => {
  it('renders with non-zero debt maximum', () => {
    const wrapper = createWrapper(LoanBrokerSet)

    expect(wrapper.find('.debt-maximum')).toHaveText(
      'Debt Maximum: \uE900100,000.00 XRP',
    )

    wrapper.unmount()
  })

  it('renders with zero debt maximum showing No Limit', () => {
    const wrapper = createWrapper(LoanBrokerSetZeroDebt)

    expect(wrapper.find('.debt-maximum')).toHaveText('Debt Maximum: No Limit')

    wrapper.unmount()
  })
})
