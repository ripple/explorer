import {
  getVault,
  getLoanBroker,
  getMPTIssuance,
  getNegativeUNL,
  getAccountInfo,
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

describe('getAccountInfo', () => {
  const AMM_ACCOUNT = 'rLjUKpwUVmz3vCTmFkXungxwzdoyrWRsFG'

  const ACCOUNT_ROOT = {
    AMMID: '2858D58ECD99108CEB105A3D9F84D293E507701878EE25612F5BF6D4A93F3B69',
    Account: AMM_ACCOUNT,
    Balance: '2716797990409',
    LedgerEntryType: 'AccountRoot',
  }

  const ACCOUNT_INFO_FAILURE = {
    error: 'internal',
    error_message: 'Internal error.',
  }

  const makeSocketSequence = (...responses: any[]) => {
    const send = jest.fn()
    responses.forEach((r) => send.mockResolvedValueOnce(r))
    return { send } as any
  }

  let warn: jest.SpyInstance

  beforeEach(() => {
    warn = jest.spyOn(console, 'warn').mockImplementation(() => {})
  })

  afterEach(() => {
    warn.mockRestore()
  })

  it('returns account_data when account_info succeeds', async () => {
    const socket = makeSocket({ account_data: ACCOUNT_ROOT, ledger_index: 1 })

    await expect(getAccountInfo(socket, AMM_ACCOUNT)).resolves.toEqual({
      ...ACCOUNT_ROOT,
      ledger_index: 1,
    })
    expect(socket.send).toHaveBeenCalledTimes(1)
  })

  it('falls back to ledger_entry when account_info fails', async () => {
    const socket = makeSocketSequence(ACCOUNT_INFO_FAILURE, {
      node: ACCOUNT_ROOT,
      ledger_index: 1,
    })

    // AMMID must survive: AccountsRouter uses it to route AMM accounts to the pool page.
    await expect(getAccountInfo(socket, AMM_ACCOUNT)).resolves.toEqual({
      ...ACCOUNT_ROOT,
      ledger_index: 1,
    })
    expect(socket.send).toHaveBeenNthCalledWith(2, {
      command: 'ledger_entry',
      account_root: AMM_ACCOUNT,
      ledger_index: 'validated',
    })
    expect(warn).toHaveBeenCalled()
  })

  it('reports 404 without falling back when the account does not exist', async () => {
    const socket = makeSocket({ error: 'actNotFound' })

    await expect(getAccountInfo(socket, AMM_ACCOUNT)).rejects.toMatchObject({
      code: 404,
    })
    expect(socket.send).toHaveBeenCalledTimes(1)
  })

  it('reports 404 when ledger_entry finds no account', async () => {
    const socket = makeSocketSequence(ACCOUNT_INFO_FAILURE, {
      error: 'entryNotFound',
      error_message: 'Entry not found.',
    })

    await expect(getAccountInfo(socket, AMM_ACCOUNT)).rejects.toMatchObject({
      code: 404,
    })
  })

  it('rejects when ledger_entry also fails', async () => {
    const socket = makeSocketSequence(
      ACCOUNT_INFO_FAILURE,
      ACCOUNT_INFO_FAILURE,
    )

    await expect(getAccountInfo(socket, AMM_ACCOUNT)).rejects.toMatchObject({
      code: 500,
    })
  })
})
