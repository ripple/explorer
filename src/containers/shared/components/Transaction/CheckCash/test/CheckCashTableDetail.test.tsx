import { createTableDetailRenderFactory } from '../../test'
import { TableDetail } from '../TableDetail'
import i18n from '../../../../../../i18n/testConfigEnglish'
import mockCheckCash from './mock_data/CheckCash.json'
import mockCheckCashDeliverMin from './mock_data/CheckCashDeliverMin.json'

const renderComponent = createTableDetailRenderFactory(TableDetail, i18n)

describe('CheckCash: TableDetail', () => {
  it('renders an exact amount', () => {
    const { container, unmount } = renderComponent(mockCheckCash)
    expect(container.querySelector('.check-cash')).toHaveTextContent(
      'Amount922.134841 XRPCheck ID2BA8B0...2380DD',
    )
    unmount()
  })

  it('renders DeliverMin with the delivered amount', () => {
    const { container, unmount } = renderComponent(mockCheckCashDeliverMin)
    expect(container.querySelector('.check-cash')).toHaveTextContent(
      'Deliver Min900.00 XRPDelivered922.134841 XRPCheck ID2BA8B0...2380DD',
    )
    unmount()
  })
})
