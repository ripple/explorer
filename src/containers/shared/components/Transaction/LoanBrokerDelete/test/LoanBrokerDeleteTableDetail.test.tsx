import i18n from '../../../../../../i18n/testConfigEnglish'
import { createTableDetailRenderFactory } from '../../test'
import { TableDetail } from '../TableDetail'
import LoanBrokerDelete from './mock_data/LoanBrokerDelete.json'

const renderComponent = createTableDetailRenderFactory(TableDetail, i18n)

describe('LoanBrokerDeleteTableDetail', () => {
  it('renders with loan broker ID', () => {
    const { container, unmount } = renderComponent(LoanBrokerDelete)

    expect(container.querySelector('.loan-broker-delete')).toHaveTextContent(
      'deleteLoan Broker ID7B3AF305C92293AF3F01088298E354E7B649F963427FA4B7F5414EF1383CB80B',
    )

    unmount()
  })
})
