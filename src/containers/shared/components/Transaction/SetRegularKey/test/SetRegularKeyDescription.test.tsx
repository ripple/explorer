import React from 'react'
import { I18nextProvider } from 'react-i18next'
import { BrowserRouter } from 'react-router-dom'
import { mount } from 'enzyme'
import i18n from '../../../../../../i18nTestConfig'
import SetRegularKey from './mock_data/SetRegularKey.json'
import SetRegularKeyUnset from './mock_data/SetRegularKeyUnsetKey.json'
import { Description } from '../Description'

function createWrapper(tx: any) {
  return mount(
    <I18nextProvider i18n={i18n}>
      <BrowserRouter>
        <Description data={tx} />
      </BrowserRouter>
    </I18nextProvider>,
  )
}

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
