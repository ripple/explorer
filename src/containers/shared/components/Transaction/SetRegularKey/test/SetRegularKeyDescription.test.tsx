import React from 'react'

import SetRegularKey from './mock_data/SetRegularKey.json'
import SetRegularKeyUnset from './mock_data/SetRegularKeyUnsetKey.json'
import { Description } from '../Description'
import { createDescriptionWrapperFactory } from '../../test'

const createWrapper = createDescriptionWrapperFactory(Description)

describe('SetRegularKey: Description', () => {
  it('renders description for transaction', () => {
    const wrapper = createWrapper(SetRegularKey)

    expect(wrapper.html()).toBe(
      `<div>set_regular_key_description <span class="regular-key">rULyyLRoZ47P33Vapew67VoiRqPrZ2ejbp</span></div>`,
    )
    wrapper.unmount()
  })

  it('renders description for transaction that unsets key', () => {
    const wrapper = createWrapper(SetRegularKeyUnset)

    expect(wrapper.html()).toBe(`<div>unset_regular_key_description</div>`)
    wrapper.unmount()
  })
})
