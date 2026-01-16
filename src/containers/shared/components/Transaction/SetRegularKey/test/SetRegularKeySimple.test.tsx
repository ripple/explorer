import SetRegularKey from './mock_data/SetRegularKey.json'
import SetRegularKeyUnset from './mock_data/SetRegularKeyUnsetKey.json'
import { Simple } from '../Simple'
import { createSimpleRenderFactory } from '../../test'

const renderComponent = createSimpleRenderFactory(Simple)

describe('SetRegularKey: Simple', () => {
  it('renders Simple for transaction', () => {
    const { container, unmount } = renderComponent(SetRegularKey)

    // The SimpleRow doesn't have a data-testid, so we use the row structure
    const row = container.querySelector('.row')
    expect(row?.querySelector('.label')).toHaveTextContent('regular_key')
    expect(row?.querySelector('.value')).toHaveTextContent(
      'rULyyLRoZ47P33Vapew67VoiRqPrZ2ejbp',
    )
    unmount()
  })

  it('renders Simple for transaction that unsets key', () => {
    const { container, unmount } = renderComponent(SetRegularKeyUnset)

    expect(container.querySelector('.unset')).toHaveTextContent(
      'unset_regular_key',
    )
    unmount()
  })
})
