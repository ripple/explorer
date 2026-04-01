import i18n from '../../../../../../i18n/testConfigEnglish'
import { createTableDetailRenderFactory } from '../../test'
import { TableDetail } from '../TableDetail'
import LoanManage from './mock_data/LoanManage.json'

const renderComponent = createTableDetailRenderFactory(TableDetail, i18n)

describe('LoanManageTableDetail', () => {
  it('renders with loan ID', () => {
    const { container, unmount } = renderComponent(LoanManage)

    expect(container.querySelector('.loan-manage')).toHaveTextContent(
      'Loan ID28375E...24CD66',
    )

    unmount()
  })
})
