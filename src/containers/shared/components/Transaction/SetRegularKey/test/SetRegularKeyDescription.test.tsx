import { cleanup, screen } from '@testing-library/react'
import SetRegularKey from './mock_data/SetRegularKey.json'
import SetRegularKeyUnset from './mock_data/SetRegularKeyUnsetKey.json'
import { Description } from '../Description'
import { createDescriptionRenderFactory } from '../../test'

const renderComponent = createDescriptionRenderFactory(Description)

describe('SetRegularKey: Description', () => {
  afterEach(cleanup)
  it('renders description for transaction', () => {
    renderComponent(SetRegularKey)

    expect(screen.html()).toBe(
      `<div>set_regular_key_description <span class="regular-key">rULyyLRoZ47P33Vapew67VoiRqPrZ2ejbp</span></div>`,
    )
  })

  it('renders description for transaction that unsets key', () => {
    renderComponent(SetRegularKeyUnset)

    expect(screen.html()).toBe(`<div>unset_regular_key_description</div>`)
  })
})
