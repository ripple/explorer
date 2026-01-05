import i18n from '../../../../../../i18n/testConfigEnglish'
import { createTableDetailWrapperFactory } from '../../test'
import { TableDetail } from '../TableDetail'
import LoanBrokerCoverDeposit from './mock_data/LoanBrokerCoverDeposit.json'

const createWrapper = createTableDetailWrapperFactory(TableDetail, i18n)

describe('LoanBrokerCoverDepositTableDetail', () => {
  it('renders with amount and loan broker ID', () => {
    const wrapper = createWrapper(LoanBrokerCoverDeposit)

    expect(wrapper.find('.loan-broker-cover-deposit')).toHaveText(
      'Send$10.00 USD.ra8dG1xwi5dQTJx1fRNCc8gjSAdQMX3vV7first-loss capital to Loan Broker ID7B3AF305C92293AF3F01088298E354E7B649F963427FA4B7F5414EF1383CB80B',
    )

    wrapper.unmount()
  })
})
