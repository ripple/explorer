/**
 * Shared Single Asset Vault helpers.
 *
 * VaultKind distinguishes a closed-ended vault from the default open-ended
 * kind, and is gated behind the `LendingProtocolV1_1` amendment. A closed-ended
 * vault also carries a SubscriptionDate/RedemptionDate pair, and is the only
 * kind a LoanBroker may be attached to.
 */

// Translation keys, so the caller can render these via t().
export const VAULT_KIND_OPEN_ENDED = 'open_ended'
export const VAULT_KIND_CLOSED_ENDED = 'closed_ended'

// VaultKind values from the XLS-65d spec.
export const VAULT_KINDS: {
  [key: number]: typeof VAULT_KIND_OPEN_ENDED | typeof VAULT_KIND_CLOSED_ENDED
} = {
  0: VAULT_KIND_OPEN_ENDED,
  1: VAULT_KIND_CLOSED_ENDED,
}
