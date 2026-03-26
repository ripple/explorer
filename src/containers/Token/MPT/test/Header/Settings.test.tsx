import { render } from '@testing-library/react'
import { I18nextProvider } from 'react-i18next'
import i18n from '../../../../../i18n/testConfig'
import { Settings } from '../../Header/Settings'

describe('Settings component', () => {
  const renderComponent = (props: any = {}) =>
    render(
      <I18nextProvider i18n={i18n}>
        <Settings flags={props.flags} />
      </I18nextProvider>,
    )

  it('renders header box with settings title', () => {
    const { container } = renderComponent()
    expect(container.querySelectorAll('.header-box.settings-box')).toHaveLength(
      1,
    )
    expect(container.querySelector('.header-box-title')).toHaveTextContent(
      'settings',
    )
  })

  it('renders all 7 flag items', () => {
    const { container } = renderComponent()
    expect(container.querySelectorAll('.header-box-item')).toHaveLength(7)
  })

  it('shows locked flag as disabled by default', () => {
    const { container } = renderComponent({ flags: [] })
    expect(container).toHaveTextContent('locked')
    expect(container).toHaveTextContent('disabled')
  })

  it('shows locked flag as enabled when present', () => {
    const { container } = renderComponent({ flags: ['lsfMPTLocked'] })
    const flagItems = container.querySelectorAll('.header-box-item')
    const lockedItem = flagItems[0]
    expect(lockedItem.querySelectorAll('.flag-status.enabled')).toHaveLength(1)
  })

  it('shows can_lock flag status', () => {
    const { container } = renderComponent({ flags: ['lsfMPTCanLock'] })
    expect(container).toHaveTextContent('can_lock')
    expect(container.querySelectorAll('.flag-status.enabled')).toHaveLength(1)
  })

  it('shows require_auth flag status', () => {
    const { container } = renderComponent({ flags: ['lsfMPTRequireAuth'] })
    expect(container).toHaveTextContent('require_auth')
    expect(container.querySelectorAll('.flag-status.enabled')).toHaveLength(1)
  })

  it('shows can_escrow flag status', () => {
    const { container } = renderComponent({ flags: ['lsfMPTCanEscrow'] })
    expect(container).toHaveTextContent('can_escrow')
    expect(container.querySelectorAll('.flag-status.enabled')).toHaveLength(1)
  })

  it('shows can_trade flag status', () => {
    const { container } = renderComponent({ flags: ['lsfMPTCanTrade'] })
    expect(container).toHaveTextContent('can_trade')
    expect(container.querySelectorAll('.flag-status.enabled')).toHaveLength(1)
  })

  it('shows can_transfer flag status', () => {
    const { container } = renderComponent({ flags: ['lsfMPTCanTransfer'] })
    expect(container).toHaveTextContent('can_transfer')
    expect(container.querySelectorAll('.flag-status.enabled')).toHaveLength(1)
  })

  it('shows can_clawback flag status', () => {
    const { container } = renderComponent({ flags: ['lsfMPTCanClawback'] })
    expect(container).toHaveTextContent('can_clawback')
    expect(container.querySelectorAll('.flag-status.enabled')).toHaveLength(1)
  })

  it('handles multiple flags enabled', () => {
    const { container } = renderComponent({
      flags: ['lsfMPTCanTransfer', 'lsfMPTCanTrade', 'lsfMPTCanLock'],
    })
    expect(container.querySelectorAll('.flag-status.enabled')).toHaveLength(3)
    expect(container.querySelectorAll('.flag-status.disabled')).toHaveLength(4)
  })

  it('handles empty flags array', () => {
    const { container } = renderComponent({ flags: [] })
    expect(container.querySelectorAll('.flag-status.enabled')).toHaveLength(0)
    expect(container.querySelectorAll('.flag-status.disabled')).toHaveLength(7)
  })

  it('handles undefined flags', () => {
    const { container } = renderComponent({ flags: undefined })
    expect(container.querySelectorAll('.flag-status.disabled')).toHaveLength(7)
  })
})
