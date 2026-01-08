import i18n from '../../../../../../i18n/testConfigEnglish'
import { createTableDetailWrapperFactory } from '../../test'
import { TableDetail } from '../TableDetail'
import LoanBrokerCoverWithdraw from './mock_data/LoanBrokerCoverWithdraw.json'

const createWrapper = createTableDetailWrapperFactory(TableDetail, i18n)

describe('LoanBrokerCoverWithdrawTableDetail', () => {
  it('renders with amount, destination, and first-loss capital', () => {
    const wrapper = createWrapper(LoanBrokerCoverWithdraw)

    expect(wrapper.find('.loan-broker-cover-withdraw')).toHaveText(
      'withdraw$5.00 USD.ra8dG1xwi5dQTJx1fRNCc8gjSAdQMX3vV7first-loss capitaltorH4absn9JcB8m943YRMNJpuR9HQs56hkr8',
    )

    wrapper.unmount()
  })
})
