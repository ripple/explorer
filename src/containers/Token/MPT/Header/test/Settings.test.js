import { mount } from 'enzyme'
import { I18nextProvider } from 'react-i18next'
import { Settings } from '../Settings'
import i18n from '../../../../../i18n/testConfig'

describe('MPT Settings container', () => {
  const flags = ['lsfMPTCanClawback', 'lsfMPTCanTransfer']

  const createWrapper = (testFlags = flags) =>
    mount(
      <I18nextProvider i18n={i18n}>
        <Settings flags={testFlags} />
      </I18nextProvider>,
    )

  it('renders without crashing', () => {
    const wrapper = createWrapper()
    wrapper.unmount()
  })

  it('renders all settings fields', () => {
    const wrapper = createWrapper()
    expect(wrapper.find('.header-box-item').length).toEqual(7)
    wrapper.unmount()
  })

  it('renders enabled flags correctly', () => {
    const wrapper = createWrapper()
    const text = wrapper.text()

    // can_transfer and can_clawback should be enabled
    expect(text).toContain('enabled')
    // Count enabled occurrences
    expect((text.match(/enabled/g) || []).length).toEqual(2)
    wrapper.unmount()
  })

  it('renders disabled flags correctly', () => {
    const wrapper = createWrapper()
    const text = wrapper.text()

    // locked, can_lock, require_auth, can_escrow, can_trade should be disabled
    expect((text.match(/disabled/g) || []).length).toEqual(5)
    wrapper.unmount()
  })

  it('renders with empty flags', () => {
    const wrapper = createWrapper([])
    const text = wrapper.text()

    // All should be disabled
    expect((text.match(/disabled/g) || []).length).toEqual(7)
    expect((text.match(/enabled/g) || []).length).toEqual(0)
    wrapper.unmount()
  })
})
