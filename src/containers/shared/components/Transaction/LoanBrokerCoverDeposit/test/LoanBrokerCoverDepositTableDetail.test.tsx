import i18n from '../../../../../../i18n/testConfigEnglish'
import { createTableDetailRenderFactory } from '../../test'
import { TableDetail } from '../TableDetail'
import LoanBrokerCoverDeposit from './mock_data/LoanBrokerCoverDeposit.json'

const renderComponent = createTableDetailRenderFactory(TableDetail, i18n)

describe('LoanBrokerCoverDepositTableDetail', () => {
  it('renders with amount and loan broker ID', () => {
    const { container, unmount } = renderComponent(LoanBrokerCoverDeposit)

    expect(
      container.querySelector('.loan-broker-cover-deposit'),
    ).toHaveTextContent(
      'Send$10.00 USD.ra8dG1xwi5dQTJx1fRNCc8gjSAdQMX3vV7first-loss capital to Loan Broker ID7B3AF305C92293AF3F01088298E354E7B649F963427FA4B7F5414EF1383CB80B',
    )

    unmount()
  })
})
