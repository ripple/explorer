import { TableDetail } from '../TableDetail'
import mockAMMDelete from './mock_data/AMMDelete.json'
import { createTableDetailRenderFactory } from '../../test'
import i18n from '../../../../../../i18n/testConfigEnglish'

const renderComponent = createTableDetailRenderFactory(TableDetail, i18n)

describe('AMMDelete: TableDetail', () => {
  it('renders with an expiration and offer', () => {
    const { container, unmount } = renderComponent(mockAMMDelete)

    expect(container.querySelector('[data-testid="asset"]')).toHaveTextContent(
      'Asset 1\uE900 XRP',
    )
    expect(container.querySelector('[data-testid="asset2"]')).toHaveTextContent(
      'Asset 2FOO.rm5c42Crqpdch5fbuCdHmSMV1wrL9arV9',
    )
    unmount()
  })
})
