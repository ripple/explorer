import i18n from '../../../../../../i18n/testConfigEnglish'
import { createTableDetailRenderFactory } from '../../test'
import { TableDetail } from '../TableDetail'
import LoanManage from './mock_data/LoanManage.json'

const renderComponent = createTableDetailRenderFactory(TableDetail, i18n)

describe('LoanManageTableDetail', () => {
  it('renders with loan ID', () => {
    const { container, unmount } = renderComponent(LoanManage)

    expect(container.querySelector('.loan-manage')).toHaveTextContent(
      'Loan ID28375E885D1F8E46502B1A6FA44B9E2EFC15244F467010082BE314AE6224CD66',
    )

    unmount()
  })
})
