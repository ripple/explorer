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

  it('renders 8 capability rows plus 2 field rows always', () => {
    // Field rows (Metadata, TransferFee) are always visible regardless of
    // immutableFlags — they show an Immutable badge when locked.
    const { container } = renderComponent()
    expect(container.querySelectorAll('.header-box-item')).toHaveLength(10)
  })

  // ── Enabled / disabled status ───────────────────────────────────────────────

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

  it('shows can_lock flag as enabled when present', () => {
    const { container } = renderComponent({ flags: ['lsfMPTCanLock'] })
    expect(container).toHaveTextContent('can_lock')
    expect(container.querySelectorAll('.flag-status.enabled')).toHaveLength(1)
  })

  it('shows require_auth flag as enabled when present', () => {
    const { container } = renderComponent({ flags: ['lsfMPTRequireAuth'] })
    expect(container).toHaveTextContent('require_auth')
    expect(container.querySelectorAll('.flag-status.enabled')).toHaveLength(1)
  })

  it('shows can_escrow flag as enabled when present', () => {
    const { container } = renderComponent({ flags: ['lsfMPTCanEscrow'] })
    expect(container).toHaveTextContent('can_escrow')
    expect(container.querySelectorAll('.flag-status.enabled')).toHaveLength(1)
  })

  it('shows can_trade flag as enabled when present', () => {
    const { container } = renderComponent({ flags: ['lsfMPTCanTrade'] })
    expect(container).toHaveTextContent('can_trade')
    expect(container.querySelectorAll('.flag-status.enabled')).toHaveLength(1)
  })

  it('shows can_transfer flag as enabled when present', () => {
    const { container } = renderComponent({ flags: ['lsfMPTCanTransfer'] })
    expect(container).toHaveTextContent('can_transfer')
    expect(container.querySelectorAll('.flag-status.enabled')).toHaveLength(1)
  })

  it('shows can_clawback flag as enabled when present', () => {
    const { container } = renderComponent({ flags: ['lsfMPTCanClawback'] })
    expect(container).toHaveTextContent('can_clawback')
    expect(container.querySelectorAll('.flag-status.enabled')).toHaveLength(1)
  })

  it('shows can_confidential_amount flag as enabled when present', () => {
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

  it('handles empty flags array — all caps disabled', () => {
    const { container } = renderComponent({ flags: [] })
    expect(container.querySelectorAll('.flag-status.enabled')).toHaveLength(0)
    expect(container.querySelectorAll('.flag-status.disabled')).toHaveLength(8)
  })

  it('handles undefined flags — all caps disabled', () => {
    const { container } = renderComponent({ flags: undefined })
    expect(container.querySelectorAll('.flag-status.disabled')).toHaveLength(8)
  })

  // ── Can Enable badge ────────────────────────────────────────────────────────
  // Appears on disabled capabilities that have not been locked via ImmutableFlags.
  // Tells holders: "the issuer can still activate this capability."

  it('shows can-enable badges for all unlocked disabled caps when no immutableFlags set', () => {
    // 7 lockable caps (canLock through canConfidentialAmount) × disabled + unlocked
    // = 7 can-enable badges. lsfMPTLocked has no immutableFlag → no badge.
    // Field rows show no badge when not locked.
    const { queryAllByTestId, container } = renderComponent({ flags: [] })
    expect(queryAllByTestId('can-enable-badge')).toHaveLength(7)
    expect(queryAllByTestId('immutable-badge')).toHaveLength(0)
    expect(container.querySelectorAll('.header-box-item')).toHaveLength(10)
  })

  it('hides can-enable badge once a capability is enabled', () => {
    // Capabilities are one-way (enable-only), so an enabled flag never needs
    // the "Can Enable" indicator.
    const { queryAllByTestId } = renderComponent({
      flags: ['lsfMPTCanLock'],
      immutableFlags: [],
    })
    // canLock is enabled → no can-enable badge for it; 6 other disabled unlocked
    expect(queryAllByTestId('can-enable-badge')).toHaveLength(6)
    expect(queryAllByTestId('immutable-badge')).toHaveLength(0)
  })

  it('hides can-enable badge once a capability is locked in immutableFlags', () => {
    // Locked = permanently disabled; "Can Enable" would be misleading.
    const { queryAllByTestId } = renderComponent({
      flags: [],
      immutableFlags: ['lsifMPTCanLock'],
    })
    // canLock is locked → no can-enable badge; 6 other disabled unlocked caps
    expect(queryAllByTestId('can-enable-badge')).toHaveLength(6)
  })

  // ── Immutable badge ─────────────────────────────────────────────────────────
  // Appears on capabilities/fields permanently locked via ImmutableFlags.
  // Tells everyone: "the issuer cannot change this — ever."

  it('shows immutable badge for a locked capability', () => {
    const { container, getAllByTestId, queryAllByTestId } = renderComponent({
      flags: [],
      immutableFlags: ['lsifMPTCanLock'],
    })
    // canLock locked → 1 immutable badge; 6 other disabled unlocked → 6 can-enable
    expect(getAllByTestId('immutable-badge')).toHaveLength(1)
    expect(queryAllByTestId('can-enable-badge')).toHaveLength(6)
    expect(container.querySelectorAll('.flag-status.immutable')).toHaveLength(1)
  })

  it('shows immutable badge for locked confidential capability', () => {
    const { getAllByTestId, queryAllByTestId } = renderComponent({
      flags: [],
      immutableFlags: ['lsifMPTCanHoldConfidentialBalance'],
    })
    expect(getAllByTestId('immutable-badge')).toHaveLength(1)
    expect(queryAllByTestId('can-enable-badge')).toHaveLength(6)
  })

  it('does not show immutable badge for an already-enabled capability', () => {
    // Once enabled, the "Immutable" badge would be redundant — the enabled status
    // is already permanent (capabilities are one-way).
    const { queryAllByTestId } = renderComponent({
      flags: ['lsfMPTCanLock'],
      immutableFlags: ['lsifMPTCanLock'],
    })
    expect(queryAllByTestId('immutable-badge')).toHaveLength(0)
  })

  // ── Field rows (Metadata / TransferFee) ─────────────────────────────────────
  // Always shown. An Immutable badge appears when locked; no badge when mutable.

  it('always shows metadata and transferFee rows regardless of immutableFlags', () => {
    const { container: withLock } = renderComponent({
      immutableFlags: ['lsifMPTMetadata', 'lsifMPTTransferFee'],
    })
    const { container: withoutLock } = renderComponent({ immutableFlags: [] })
    // Both states → 8 cap rows + 2 field rows = 10
    expect(withLock.querySelectorAll('.header-box-item')).toHaveLength(10)
    expect(withoutLock.querySelectorAll('.header-box-item')).toHaveLength(10)
  })

  it('shows immutable badges on field rows when locked', () => {
    const { getAllByTestId, queryAllByTestId } = renderComponent({
      flags: [],
      immutableFlags: ['lsifMPTMetadata', 'lsifMPTTransferFee'],
    })
    // 2 immutable badges on field rows; 7 can-enable on unlocked disabled caps
    expect(getAllByTestId('immutable-badge')).toHaveLength(2)
    expect(queryAllByTestId('can-enable-badge')).toHaveLength(7)
  })

  it('shows no badges on field rows when not locked', () => {
    const { queryAllByTestId } = renderComponent({
      flags: [],
      immutableFlags: [],
    })
    expect(queryAllByTestId('immutable-badge')).toHaveLength(0)
    expect(queryAllByTestId('can-enable-badge')).toHaveLength(7)
  })
})
