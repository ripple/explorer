import {
  getVault,
  getLoanBroker,
  getMPTIssuance,
  getNegativeUNL,
} from '../rippled'

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

describe('getLoanBroker', () => {
  const LOAN_BROKER_INDEX =
    '1111111111111111111111111111111111111111111111111111111111111111'

  it('returns resp.node when the ledger entry is a LoanBroker', async () => {
    const node = {
      LedgerEntryType: 'LoanBroker',
      Owner: 'rExampleLoanBrokerOwner',
      index: LOAN_BROKER_INDEX,
    }
    const socket = makeSocket({ index: LOAN_BROKER_INDEX, node })

    await expect(getLoanBroker(socket, LOAN_BROKER_INDEX)).resolves.toEqual(
      node,
    )
  })

  it('throws when the ledger entry is not a LoanBroker (e.g. Check)', async () => {
    const socket = makeSocket({
      index: LOAN_BROKER_INDEX,
      node: {
        LedgerEntryType: 'Check',
        Account: 'rExampleCheckSender',
        index: LOAN_BROKER_INDEX,
      },
    })

    await expect(
      getLoanBroker(socket, LOAN_BROKER_INDEX),
    ).rejects.toMatchObject({
      message: 'Not a LoanBroker',
      code: 404,
    })
  })

  it('throws "LoanBroker not found" when rippled returns entryNotFound', async () => {
    const socket = makeSocket({ error: 'entryNotFound' })

    await expect(
      getLoanBroker(socket, LOAN_BROKER_INDEX),
    ).rejects.toMatchObject({
      message: 'LoanBroker not found',
      code: 404,
    })
  })
})

describe('getMPTIssuance', () => {
  const MPT_ID = '00002AF2588C244FE5F74BF48B5C5E2823235B243AA34634'

  it('returns the full response when the ledger entry is an MPTokenIssuance', async () => {
    const resp = {
      node: {
        LedgerEntryType: 'MPTokenIssuance',
        Issuer: 'rExampleMPTIssuer',
        Sequence: 1,
      },
      ledger_index: 100,
      validated: true,
    }
    const socket = makeSocket(resp)

    await expect(getMPTIssuance(socket, MPT_ID)).resolves.toEqual(resp)
  })

  it('throws when the ledger entry is not an MPTokenIssuance', async () => {
    const socket = makeSocket({
      node: {
        LedgerEntryType: 'Vault',
        Owner: 'rExampleVaultOwner',
      },
      validated: true,
    })

    await expect(getMPTIssuance(socket, MPT_ID)).rejects.toMatchObject({
      message: 'Not an MPTokenIssuance',
      code: 404,
    })
  })

  it('throws "MPT Issuance not found" when rippled returns entryNotFound', async () => {
    const socket = makeSocket({ error: 'entryNotFound' })

    await expect(getMPTIssuance(socket, MPT_ID)).rejects.toMatchObject({
      message: 'MPT Issuance not found',
      code: 404,
    })
  })
})

describe('getNegativeUNL', () => {
  it('returns the full response when the ledger entry is a NegativeUNL', async () => {
    const resp = {
      node: {
        LedgerEntryType: 'NegativeUNL',
        DisabledValidators: [],
      },
      validated: true,
    }
    const socket = makeSocket(resp)

    await expect(getNegativeUNL(socket)).resolves.toEqual(resp)
  })

  it('throws when the ledger entry is not a NegativeUNL', async () => {
    const socket = makeSocket({
      node: { LedgerEntryType: 'AccountRoot' },
      validated: true,
    })

    await expect(getNegativeUNL(socket)).rejects.toMatchObject({
      message: 'Not a NegativeUNL',
      code: 404,
    })
  })

  it('returns [] when the entry is missing', async () => {
    const socket = makeSocket({ error: 'entryNotFound' })

    await expect(getNegativeUNL(socket)).resolves.toEqual([])
  })
})
