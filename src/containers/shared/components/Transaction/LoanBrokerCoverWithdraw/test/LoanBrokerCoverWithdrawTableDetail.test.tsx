import i18n from '../../../../../../i18n/testConfigEnglish'
import { createTableDetailRenderFactory } from '../../test'
import { TableDetail } from '../TableDetail'
import LoanBrokerCoverWithdraw from './mock_data/LoanBrokerCoverWithdraw.json'

const renderComponent = createTableDetailRenderFactory(TableDetail, i18n)

describe('LoanBrokerCoverWithdrawTableDetail', () => {
  it('renders with amount, destination, and first-loss capital', () => {
    const { container, unmount } = renderComponent(LoanBrokerCoverWithdraw)

    expect(
      container.querySelector('.loan-broker-cover-withdraw'),
    ).toHaveTextContent(
      'withdraw$5.00 USD.ra8dG1xwi5dQTJx1fRNCc8gjSAdQMX3vV7first-loss capitaltorH4absn9JcB8m943YRMNJpuR9HQs56hkr8',
    )

    unmount()
  })
})
