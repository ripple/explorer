import { mount } from 'enzyme'
import { I18nextProvider } from 'react-i18next'
import i18n from '../../../../../i18n/testConfig'
import { Settings } from '../../Header/Settings'

describe('Settings component', () => {
  const createWrapper = (props: any = {}) =>
    mount(
      <I18nextProvider i18n={i18n}>
        <Settings flags={props.flags} />
      </I18nextProvider>,
    )

  it('renders header box with settings title', () => {
    const wrapper = createWrapper()
    expect(wrapper.find('.header-box.settings-box').length).toBe(1)
    expect(wrapper.find('.header-box-title').text()).toBe('settings')
    wrapper.unmount()
  })

  it('renders all 7 flag items', () => {
    const wrapper = createWrapper()
    expect(wrapper.find('.header-box-item').length).toBe(7)
    wrapper.unmount()
  })

  it('shows locked flag as disabled by default', () => {
    const wrapper = createWrapper({ flags: [] })
    expect(wrapper.text()).toContain('locked')
    expect(wrapper.text()).toContain('disabled')
    wrapper.unmount()
  })

  it('shows locked flag as enabled when present', () => {
    const wrapper = createWrapper({ flags: ['lsfMPTLocked'] })
    const flagItems = wrapper.find('.header-box-item')
    const lockedItem = flagItems.at(0)
    expect(lockedItem.find('.flag-status.enabled').length).toBe(1)
    wrapper.unmount()
  })

  it('shows can_lock flag status', () => {
    const wrapper = createWrapper({ flags: ['lsfMPTCanLock'] })
    expect(wrapper.text()).toContain('can_lock')
    expect(wrapper.find('.flag-status.enabled').length).toBe(1)
    wrapper.unmount()
  })

  it('shows require_auth flag status', () => {
    const wrapper = createWrapper({ flags: ['lsfMPTRequireAuth'] })
    expect(wrapper.text()).toContain('require_auth')
    expect(wrapper.find('.flag-status.enabled').length).toBe(1)
    wrapper.unmount()
  })

  it('shows can_escrow flag status', () => {
    const wrapper = createWrapper({ flags: ['lsfMPTCanEscrow'] })
    expect(wrapper.text()).toContain('can_escrow')
    expect(wrapper.find('.flag-status.enabled').length).toBe(1)
    wrapper.unmount()
  })

  it('shows can_trade flag status', () => {
    const wrapper = createWrapper({ flags: ['lsfMPTCanTrade'] })
    expect(wrapper.text()).toContain('can_trade')
    expect(wrapper.find('.flag-status.enabled').length).toBe(1)
    wrapper.unmount()
  })

  it('shows can_transfer flag status', () => {
    const wrapper = createWrapper({ flags: ['lsfMPTCanTransfer'] })
    expect(wrapper.text()).toContain('can_transfer')
    expect(wrapper.find('.flag-status.enabled').length).toBe(1)
    wrapper.unmount()
  })

  it('shows can_clawback flag status', () => {
    const wrapper = createWrapper({ flags: ['lsfMPTCanClawback'] })
    expect(wrapper.text()).toContain('can_clawback')
    expect(wrapper.find('.flag-status.enabled').length).toBe(1)
    wrapper.unmount()
  })

  it('handles multiple flags enabled', () => {
    const wrapper = createWrapper({
      flags: ['lsfMPTCanTransfer', 'lsfMPTCanTrade', 'lsfMPTCanLock'],
    })
    expect(wrapper.find('.flag-status.enabled').length).toBe(3)
    expect(wrapper.find('.flag-status.disabled').length).toBe(4)
    wrapper.unmount()
  })

  it('handles empty flags array', () => {
    const wrapper = createWrapper({ flags: [] })
    expect(wrapper.find('.flag-status.enabled').length).toBe(0)
    expect(wrapper.find('.flag-status.disabled').length).toBe(7)
    wrapper.unmount()
  })

  it('handles undefined flags', () => {
    const wrapper = createWrapper({ flags: undefined })
    expect(wrapper.find('.flag-status.disabled').length).toBe(7)
    wrapper.unmount()
  })
})
