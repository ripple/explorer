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

  it('renders 7 capability rows and 2 field rows (9 total), no Locked row', () => {
    // lsfMPTLocked is surfaced in General Overview, not Settings.
    const { container } = renderComponent()
    expect(container.querySelectorAll('.header-box-item')).toHaveLength(9)
  })

  // ── Capability enabled state ─────────────────────────────────────────────────

  it('shows only Enabled badge for an enabled capability — no second pill', () => {
    const { queryAllByTestId } = renderComponent({
      flags: ['lsfMPTCanLock'],
    })
    // Enabled caps show one pill only; 6 disabled caps each show Disabled + Mutable
    expect(queryAllByTestId('enabled-badge')).toHaveLength(1)
    expect(queryAllByTestId('disabled-badge')).toHaveLength(6)
    expect(queryAllByTestId('mutable-badge')).toHaveLength(6 + 2) // 6 caps + 2 fields
    expect(queryAllByTestId('immutable-badge')).toHaveLength(0)
  })

  it('shows Enabled for can_lock when lsfMPTCanLock present', () => {
    const { container } = renderComponent({ flags: ['lsfMPTCanLock'] })
    expect(container).toHaveTextContent('can_lock')
    expect(queryAllEnabled(container)).toHaveLength(1)
  })

  it('shows Enabled for require_auth when lsfMPTRequireAuth present', () => {
    const { container } = renderComponent({ flags: ['lsfMPTRequireAuth'] })
    expect(container).toHaveTextContent('require_auth')
    expect(queryAllEnabled(container)).toHaveLength(1)
  })

  it('shows Enabled for can_escrow when lsfMPTCanEscrow present', () => {
    const { container } = renderComponent({ flags: ['lsfMPTCanEscrow'] })
    expect(queryAllEnabled(container)).toHaveLength(1)
  })

  it('shows Enabled for can_trade when lsfMPTCanTrade present', () => {
    const { container } = renderComponent({ flags: ['lsfMPTCanTrade'] })
    expect(queryAllEnabled(container)).toHaveLength(1)
  })

  it('shows Enabled for can_transfer when lsfMPTCanTransfer present', () => {
    const { container } = renderComponent({ flags: ['lsfMPTCanTransfer'] })
    expect(queryAllEnabled(container)).toHaveLength(1)
  })

  it('shows Enabled for can_clawback when lsfMPTCanClawback present', () => {
    const { container } = renderComponent({ flags: ['lsfMPTCanClawback'] })
    expect(queryAllEnabled(container)).toHaveLength(1)
  })

  it('shows Enabled for can_confidential_amount when lsfMPTCanHoldConfidentialBalance present', () => {
    const { container } = renderComponent({
      flags: ['lsfMPTCanHoldConfidentialBalance'],
    })
    expect(queryAllEnabled(container)).toHaveLength(1)
  })

  it('handles multiple enabled capabilities', () => {
    const { queryAllByTestId } = renderComponent({
      flags: ['lsfMPTCanTransfer', 'lsfMPTCanTrade', 'lsfMPTCanLock'],
    })
    expect(queryAllByTestId('enabled-badge')).toHaveLength(3)
    expect(queryAllByTestId('disabled-badge')).toHaveLength(4)
    expect(queryAllByTestId('mutable-badge')).toHaveLength(4 + 2) // 4 disabled caps + 2 fields
  })

  // ── Disabled + Mutable (default state) ──────────────────────────────────────

  it('shows Disabled + Mutable on every capability when nothing is set', () => {
    const { queryAllByTestId } = renderComponent({ flags: [] })
    expect(queryAllByTestId('disabled-badge')).toHaveLength(7)
    expect(queryAllByTestId('mutable-badge')).toHaveLength(7 + 2) // 7 caps + 2 fields
    expect(queryAllByTestId('enabled-badge')).toHaveLength(0)
    expect(queryAllByTestId('immutable-badge')).toHaveLength(0)
  })

  it('shows Disabled + Mutable with undefined flags', () => {
    const { queryAllByTestId } = renderComponent({ flags: undefined })
    expect(queryAllByTestId('disabled-badge')).toHaveLength(7)
    expect(queryAllByTestId('mutable-badge')).toHaveLength(9)
  })

  // ── Disabled + Immutable (locked capabilities) ───────────────────────────────

  it('shows Disabled + Immutable for a locked capability', () => {
    const { queryAllByTestId } = renderComponent({
      flags: [],
      immutableFlags: ['lsifMPTCanLock'],
    })
    // canLock locked: Disabled + Immutable; 6 others: Disabled + Mutable; 2 fields: Mutable
    expect(queryAllByTestId('immutable-badge')).toHaveLength(1)
    expect(queryAllByTestId('disabled-badge')).toHaveLength(7)
    expect(queryAllByTestId('mutable-badge')).toHaveLength(6 + 2)
  })

  it('shows Disabled + Immutable for locked confidential capability', () => {
    const { queryAllByTestId } = renderComponent({
      flags: [],
      immutableFlags: ['lsifMPTCanHoldConfidentialBalance'],
    })
    expect(queryAllByTestId('immutable-badge')).toHaveLength(1)
    expect(queryAllByTestId('mutable-badge')).toHaveLength(6 + 2)
  })

  it('shows Immutable on multiple locked capabilities', () => {
    const { queryAllByTestId } = renderComponent({
      flags: [],
      immutableFlags: [
        'lsifMPTCanLock',
        'lsifMPTRequireAuth',
        'lsifMPTCanEscrow',
      ],
    })
    expect(queryAllByTestId('immutable-badge')).toHaveLength(3)
    expect(queryAllByTestId('mutable-badge')).toHaveLength(4 + 2)
  })

  // ── Field rows ───────────────────────────────────────────────────────────────
  // Always visible. Show Mutable when changeable, Immutable when frozen.

  it('shows Mutable on both field rows when neither is locked', () => {
    const { queryAllByTestId } = renderComponent({
      flags: [],
      immutableFlags: [],
    })
    // 7 caps (Mutable) + 2 fields (Mutable) = 9
    expect(queryAllByTestId('mutable-badge')).toHaveLength(9)
    expect(queryAllByTestId('immutable-badge')).toHaveLength(0)
  })

  it('shows Immutable on metadata field when lsifMPTMetadata is locked', () => {
    const { queryAllByTestId } = renderComponent({
      flags: [],
      immutableFlags: ['lsifMPTMetadata'],
    })
    // 7 cap Mutable + 1 field Immutable (metadata) + 1 field Mutable (transferFee)
    expect(queryAllByTestId('immutable-badge')).toHaveLength(1)
    expect(queryAllByTestId('mutable-badge')).toHaveLength(7 + 1)
  })

  it('shows Immutable on both field rows when both are locked', () => {
    const { queryAllByTestId } = renderComponent({
      flags: [],
      immutableFlags: ['lsifMPTMetadata', 'lsifMPTTransferFee'],
    })
    expect(queryAllByTestId('immutable-badge')).toHaveLength(2)
    expect(queryAllByTestId('mutable-badge')).toHaveLength(7) // only caps
  })

  it('always renders both field rows regardless of immutableFlags', () => {
    const { container: locked } = renderComponent({
      immutableFlags: ['lsifMPTMetadata', 'lsifMPTTransferFee'],
    })
    const { container: unlocked } = renderComponent({ immutableFlags: [] })
    expect(locked.querySelectorAll('.header-box-item')).toHaveLength(9)
    expect(unlocked.querySelectorAll('.header-box-item')).toHaveLength(9)
  })

  // ── Pill class names ─────────────────────────────────────────────────────────

  it('uses correct CSS class for immutable pill', () => {
    const { container } = renderComponent({
      flags: [],
      immutableFlags: ['lsifMPTCanLock'],
    })
    expect(container.querySelectorAll('.flag-status.immutable')).toHaveLength(1)
  })

  it('uses correct CSS class for mutable pill', () => {
    const { container } = renderComponent({ flags: [], immutableFlags: [] })
    expect(container.querySelectorAll('.flag-status.mutable')).toHaveLength(9)
  })
})

function queryAllEnabled(container: HTMLElement) {
  return container.querySelectorAll('.flag-status.enabled')
}
