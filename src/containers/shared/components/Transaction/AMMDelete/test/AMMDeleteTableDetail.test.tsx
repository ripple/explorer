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

    expect(screen.getByTestId('asset')).toHaveTextContent('Asset 1\uE900 XRP')
    expect(screen.getByTestId('asset2')).toHaveTextContent(
      'Asset 2FOO.rm5c42Crqpdch5fbuCdHmSMV1wrL9arV9',
    )
  })
})
