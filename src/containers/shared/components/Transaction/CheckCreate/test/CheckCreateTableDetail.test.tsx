import { createTableDetailRenderFactory } from '../../test'
import { TableDetail } from '../TableDetail'
import i18n from '../../../../../../i18n/testConfigEnglish'
import mockCheckCreate from './mock_data/CheckCreate.json'
import mockCheckCreateWithOptionalFields from './mock_data/CheckCreateWithOptionalFields.json'

const renderComponent = createTableDetailRenderFactory(TableDetail, i18n)

describe('CheckCreate: TableDetail', () => {
  it('renders', () => {
    const { container, unmount } = renderComponent(mockCheckCreate)
    expect(container.querySelector('.check-create')).toHaveTextContent(
      'Max Amount1,844.800818 XRPtorDkirQ9393dw6om8J999UWpxxg2yhSQeRF',
    )
    unmount()
  })

  it('renders an IOU limit and destination tag', () => {
    const { container, unmount } = renderComponent(
      mockCheckCreateWithOptionalFields,
    )
    expect(container.querySelector('.check-create')).toHaveTextContent(
      'Max Amount$125.50 USD.rhub8VRN55s94qWKDv6jmDy1pUykJzF3wqtorDkirQ9393dw6om8J999UWpxxg2yhSQeRF:12345',
    )
    unmount()
  })
})
