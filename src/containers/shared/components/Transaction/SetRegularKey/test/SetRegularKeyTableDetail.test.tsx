import SetRegularKey from './mock_data/SetRegularKey.json'
import SetRegularKeyUnset from './mock_data/SetRegularKeyUnsetKey.json'
import { TableDetail } from '../TableDetail'
import { createTableDetailRenderFactory } from '../../test'

const renderComponent = createTableDetailRenderFactory(TableDetail)

describe('SetRegularKeyTable: Detail', () => {
  it('renders Simple for transaction', () => {
    const { container, unmount } = renderComponent(SetRegularKey)

    expect(container.querySelector('.setregularkey')).toBeInTheDocument()
    expect(container.querySelector('.label')).toHaveTextContent('regular_key')
    expect(container.querySelector('.key')).toHaveTextContent(
      'rULyyLRoZ47P33Vapew67VoiRqPrZ2ejbp',
    )
    unmount()
  })

  it('renders Simple for transaction that unsets key', () => {
    const { container, unmount } = renderComponent(SetRegularKeyUnset)

    expect(container.querySelector('.unset')).toBeInTheDocument()
    expect(container).toHaveTextContent('unset_regular_key')
    unmount()
  })
})
