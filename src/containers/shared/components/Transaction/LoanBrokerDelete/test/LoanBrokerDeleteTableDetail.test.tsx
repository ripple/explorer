import i18n from '../../../../../../i18n/testConfigEnglish'
import { createTableDetailWrapperFactory } from '../../test'
import { TableDetail } from '../TableDetail'
import LoanBrokerDelete from './mock_data/LoanBrokerDelete.json'

const createWrapper = createTableDetailWrapperFactory(TableDetail, i18n)

describe('LoanBrokerDeleteTableDetail', () => {
  it('renders with loan broker ID', () => {
    const wrapper = createWrapper(LoanBrokerDelete)

    expect(wrapper.find('.loan-broker-delete')).toHaveText(
      'deleteLoan Broker ID7B3AF305C92293AF3F01088298E354E7B649F963427FA4B7F5414EF1383CB80B',
    )

    wrapper.unmount()
  })
})
