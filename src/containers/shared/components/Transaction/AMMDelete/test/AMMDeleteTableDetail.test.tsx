import { TableDetail } from '../TableDetail'
import mockAMMDelete from './mock_data/AMMDelete.json'
import { createTableDetailWrapperFactory } from '../../test'

const createWrapper = createTableDetailWrapperFactory(TableDetail)

describe('AMMDelete: TableDetail', () => {
  it('renders with an expiration and offer', () => {
    const wrapper = createWrapper(mockAMMDelete)

    expect(wrapper.find('[data-test="asset"]')).toHaveText('asset\uE900 XRP')
    expect(wrapper.find('[data-test="asset2"]')).toHaveText(
      'asset2FOO.rm5c42Crqpdch5fbuCdHmSMV1wrL9arV9',
    )
    wrapper.unmount()
  })
})
