import SetRegularKey from './mock_data/SetRegularKey.json'
import SetRegularKeyUnset from './mock_data/SetRegularKeyUnsetKey.json'
import { Description } from '../Description'
import { createDescriptionRenderFactory } from '../../test'

const renderComponent = createDescriptionRenderFactory(Description)

describe('SetRegularKey: Description', () => {
  it('renders description for transaction', () => {
    const { container, unmount } = renderComponent(SetRegularKey)

    expect(container.innerHTML).toBe(
      `<div>set_regular_key_description <span class="regular-key">rULyyLRoZ47P33Vapew67VoiRqPrZ2ejbp</span></div>`,
    )
    unmount()
  })

  it('renders description for transaction that unsets key', () => {
    const { container, unmount } = renderComponent(SetRegularKeyUnset)

    expect(container.innerHTML).toBe(`<div>unset_regular_key_description</div>`)
    unmount()
  })
})
