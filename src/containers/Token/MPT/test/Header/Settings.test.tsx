import { render } from '@testing-library/react'
import { I18nextProvider } from 'react-i18next'
import i18n from '../../../../../i18n/testConfig'
import { Settings } from '../../Header/Settings'

describe('Settings component', () => {
  const renderComponent = (props: any = {}) =>
    render(
      <I18nextProvider i18n={i18n}>
        <Settings flags={props.flags} immutableFlags={props.immutableFlags} />
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

  it('renders 8 capability flag items plus 2 field rows by default', () => {
    // With no immutableFlags, metadata and transferFee field rows are shown
    // (they are still mutable), giving 8 capability rows + 2 field rows = 10.
    const { container } = renderComponent()
    expect(container.querySelectorAll('.header-box-item')).toHaveLength(10)
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

  it('shows can_confidential_amount flag status', () => {
    const { container } = renderComponent({
      flags: ['lsfMPTCanConfidentialAmount'],
    })
    expect(container).toHaveTextContent('can_confidential_amount')
    expect(container.querySelectorAll('.flag-status.enabled')).toHaveLength(1)
  })

  it('handles multiple flags enabled', () => {
    const { container } = renderComponent({
      flags: ['lsfMPTCanTransfer', 'lsfMPTCanTrade', 'lsfMPTCanLock'],
    })
    expect(container.querySelectorAll('.flag-status.enabled')).toHaveLength(3)
    expect(container.querySelectorAll('.flag-status.disabled')).toHaveLength(5)
  })

  it('handles empty flags array', () => {
    const { container } = renderComponent({ flags: [] })
    expect(container.querySelectorAll('.flag-status.enabled')).toHaveLength(0)
    expect(container.querySelectorAll('.flag-status.disabled')).toHaveLength(8)
  })

  it('handles undefined flags', () => {
    const { container } = renderComponent({ flags: undefined })
    expect(container.querySelectorAll('.flag-status.disabled')).toHaveLength(8)
  })

  it('shows mutable badges for all unlocked disabled caps and field rows when no immutableFlags set', () => {
    // With no immutableFlags, all capabilities are still mutable and both field
    // rows (metadata, transferFee) are visible. 6 disabled cap badges + 2 field
    // row badges = 8 total.
    const { queryAllByTestId, container } = renderComponent({ flags: [] })
    expect(queryAllByTestId('mutable-badge')).toHaveLength(8)
    // 8 capability rows + metadata + transferFee field rows
    expect(container.querySelectorAll('.header-box-item')).toHaveLength(10)
  })

  it('hides the mutable badge for a capability once it is locked (in immutableFlags)', () => {
    const { container, getAllByTestId } = renderComponent({
      flags: [],
      immutableFlags: ['lsifMPTCanLock'],
    })
    // lsifMPTCanLock is locked → its badge is hidden; 5 other disabled caps +
    // 2 field rows still show badges = 7 total
    expect(getAllByTestId('mutable-badge')).toHaveLength(7)
    expect(container.querySelectorAll('.flag-status.mutable')).toHaveLength(7)
  })

  it('hides the mutable badge once a capability is enabled', () => {
    // Capabilities are one-directional (enable-only), so a mutable badge on an
    // already-enabled flag would be misleading.
    const { queryAllByTestId } = renderComponent({
      flags: ['lsfMPTCanLock'],
      immutableFlags: [],
    })
    // canLock is enabled → no badge for it; 5 other disabled caps + 2 field
    // rows still show badges = 7 total
    expect(queryAllByTestId('mutable-badge')).toHaveLength(7)
  })

  it('hides extra field rows for metadata and transferFee when locked in immutableFlags', () => {
    const { container } = renderComponent({
      flags: [],
      immutableFlags: ['lsifMPTMetadata', 'lsifMPTTransferFee'],
    })
    // 8 capability rows only (field rows are hidden when locked)
    expect(container.querySelectorAll('.header-box-item')).toHaveLength(8)
  })

  it('shows extra rows for mutable metadata and transfer fee when not locked', () => {
    const { container, getAllByTestId } = renderComponent({
      flags: [],
      immutableFlags: [],
    })
    // 8 capability rows + metadata + transfer fee (both still mutable)
    expect(container.querySelectorAll('.header-box-item')).toHaveLength(10)
    // badges: 6 disabled cap flags (not locked) + 2 field row badges = 8
    expect(getAllByTestId('mutable-badge')).toHaveLength(8)
  })
})
