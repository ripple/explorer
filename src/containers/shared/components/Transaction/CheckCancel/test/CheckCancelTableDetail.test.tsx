import { createTableDetailRenderFactory } from '../../test'
import { TableDetail } from '../TableDetail'
import i18n from '../../../../../../i18n/testConfigEnglish'
import mockCheckCancel from './mock_data/CheckCancel.json'

const renderComponent = createTableDetailRenderFactory(TableDetail, i18n)

describe('CheckCancel: TableDetail', () => {
  it('renders', () => {
    const { container, unmount } = renderComponent(mockCheckCancel)
    expect(container.querySelector('.check-cancel')).toHaveTextContent(
      'Check ID2BA8B0...2380DD',
    )
    unmount()
  })
})
