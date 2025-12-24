import i18n from '../../../../../../i18n/testConfigEnglish'
import { createTableDetailWrapperFactory } from '../../test'
import { TableDetail } from '../TableDetail'
import LoanManage from './mock_data/LoanManage.json'

const createWrapper = createTableDetailWrapperFactory(TableDetail, i18n)

describe('LoanManageTableDetail', () => {
  it('renders with loan ID', () => {
    const wrapper = createWrapper(LoanManage)

    expect(wrapper.find('.loan-manage')).toHaveText(
      'Loan ID28375E885D1F8E46502B1A6FA44B9E2EFC15244F467010082BE314AE6224CD66',
    )

    wrapper.unmount()
  })
})
