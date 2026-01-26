import i18n from '../../../../../../i18n/testConfigEnglish'
import { createTableDetailRenderFactory } from '../../test'
import { TableDetail } from '../TableDetail'
import LoanDelete from './mock_data/LoanDelete.json'

const renderComponent = createTableDetailRenderFactory(TableDetail, i18n)

describe('LoanDeleteTableDetail', () => {
  it('renders with delete action and loan ID', () => {
    const { container, unmount } = renderComponent(LoanDelete)

    expect(container.querySelector('.loan-delete')).toHaveTextContent(
      'deletesLoan ID28375E885D1F8E46502B1A6FA44B9E2EFC15244F467010082BE314AE6224CD66',
    )

    unmount()
  })
})
