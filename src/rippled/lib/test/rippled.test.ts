import { getVault } from '../rippled'

// TODO: Future revisions should add unit-test coverage for the other methods
// exported from src/rippled/lib/rippled.ts (getTransaction, getLedger,
// getNFTInfo, getAccountInfo, getLoanBroker, etc.). Each has its own
// error-handling branches that deserve direct coverage.

const VAULT_INDEX =
  'EF98FDBA404CBEB4F746DA1026B859E260BBB459D111268F6A26BBC7C4811A04'

const makeSocket = (response: any) =>
  ({ send: jest.fn().mockResolvedValue(response) }) as any

describe('getVault', () => {
  it('queries ledger_entry with the supplied vault id', async () => {
    const socket = makeSocket({
      node: { LedgerEntryType: 'Vault', index: VAULT_INDEX },
    })

    await getVault(socket, VAULT_INDEX)

    expect(socket.send).toHaveBeenCalledWith({
      command: 'ledger_entry',
      index: VAULT_INDEX,
      ledger_index: 'validated',
    })
  })

  it('returns resp.node when the ledger entry is a Vault', async () => {
    const node = {
      LedgerEntryType: 'Vault',
      Owner: 'rExampleVaultOwner',
      index: VAULT_INDEX,
    }
    const socket = makeSocket({ index: VAULT_INDEX, node, validated: true })

    await expect(getVault(socket, VAULT_INDEX)).resolves.toEqual(node)
  })

  it('throws when the ledger entry is not a Vault', async () => {
    // Real devnet response captured 2026-04-27 — this index resolves to a
    // PermissionedDomain, not a Vault.
    const socket = makeSocket({
      index: VAULT_INDEX,
      node: {
        LedgerEntryType: 'PermissionedDomain',
        Owner: 'rKhgwxANWk65QtQziFGeh6AfYwchpnvzzk',
        index: VAULT_INDEX,
      },
      validated: true,
    })

    await expect(getVault(socket, VAULT_INDEX)).rejects.toMatchObject({
      message: 'Not a Vault',
      code: 404,
    })
  })

  it('throws "Vault not found" when rippled returns entryNotFound', async () => {
    const socket = makeSocket({ error: 'entryNotFound' })

    await expect(getVault(socket, VAULT_INDEX)).rejects.toMatchObject({
      message: 'Vault not found',
      code: 404,
    })
  })

  it('throws on invalidParams', async () => {
    const socket = makeSocket({ error_message: 'invalidParams' })

    await expect(getVault(socket, VAULT_INDEX)).rejects.toMatchObject({
      message: 'invalidParams for ledger_entry',
      code: 404,
    })
  })

  it('throws on lgrNotFound', async () => {
    const socket = makeSocket({ error_message: 'lgrNotFound' })

    await expect(getVault(socket, VAULT_INDEX)).rejects.toMatchObject({
      message: 'invalid ledger index/hash',
      code: 400,
    })
  })

  it('throws "Invalid vault ID format" for non-hex ids', async () => {
    const socket = makeSocket({
      error_message: '"1234" is not hex string',
    })

    await expect(getVault(socket, '1234')).rejects.toMatchObject({
      message: 'Invalid vault ID format',
      code: 400,
    })
  })

  it('throws a 500 for any other error_message', async () => {
    const socket = makeSocket({ error_message: 'unexpected failure' })

    await expect(getVault(socket, VAULT_INDEX)).rejects.toMatchObject({
      message: 'unexpected failure',
      code: 500,
    })
  })
})
