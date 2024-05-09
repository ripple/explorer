import { cleanup, screen } from '@testing-library/react'
import { TableDetail } from '../TableDetail'
import mockAMMDelete from './mock_data/AMMDelete.json'
import { createTableDetailRenderFactory } from '../../test'
import i18n from '../../../../../../i18n/testConfigEnglish'

const renderComponent = createTableDetailRenderFactory(TableDetail, i18n)

describe('AMMDelete: TableDetail', () => {
  afterEach(cleanup)
  it('renders with an expiration and offer', () => {
    renderComponent(mockAMMDelete)

    expect(wrapper.find('[data-testid="asset"]')).toHaveText(
      'Asset 1\uE900 XRP',
    )
    expect(wrapper.find('[data-testid="asset2"]')).toHaveText(
      'Asset 2FOO.rm5c42Crqpdch5fbuCdHmSMV1wrL9arV9',
    )
    wrapper.unmount()
  })
})
