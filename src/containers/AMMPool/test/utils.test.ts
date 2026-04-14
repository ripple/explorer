import { getDeletedAMMData, formatDepositWithdraw } from '../utils'
import { LOSAMMDepositWithdrawRaw } from '../types'
import mockDeletedTx from './mockDeletedAMMTransaction.json'

jest.mock('../../../rippled/lib/rippled', () => ({
  getAccountTransactions: jest.fn(),
}))

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { getAccountTransactions } = require('../../../rippled/lib/rippled')

describe('getDeletedAMMData', () => {
  const mockSocket = {} as any

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('returns deleted AMM data when last tx has DeletedNode with LedgerEntryType AMM', async () => {
    getAccountTransactions.mockResolvedValue(mockDeletedTx)

    const result = await getDeletedAMMData(
      mockSocket,
      'rQhuJV3eVEm6D6YreeisJkvfyBBA3qAXrL',
    )

    expect(result).not.toBeNull()
    expect(result!.account).toBe('rQhuJV3eVEm6D6YreeisJkvfyBBA3qAXrL')
    expect(result!.asset).toEqual({ currency: 'XRP' })
    expect(result!.asset2).toEqual({
      currency: '504958454C530000000000000000000000000000',
      issuer: 'rNEQb5e4DZUJG48xKPstDWjmm1PQ4fcUfZ',
    })
    expect(result!.lpToken).toEqual({
      currency: '0370963F20A61AF3C6E5D674EAAEE3E65C0BDC9F',
      issuer: 'rQhuJV3eVEm6D6YreeisJkvfyBBA3qAXrL',
      value: '2764439179.245265',
    })
    expect(result!.deletionDate).toBe(827617760)
  })

  it('calls getAccountTransactions with limit=1', async () => {
    getAccountTransactions.mockResolvedValue(mockDeletedTx)

    await getDeletedAMMData(mockSocket, 'rQhuJV3eVEm6D6YreeisJkvfyBBA3qAXrL')

    expect(getAccountTransactions).toHaveBeenCalledWith(
      mockSocket,
      'rQhuJV3eVEm6D6YreeisJkvfyBBA3qAXrL',
      1,
      '',
    )
  })

  it('returns null when last tx has no DeletedNode with AMM type', async () => {
    getAccountTransactions.mockResolvedValue({
      transactions: [
        {
          tx: { TransactionType: 'Payment' },
          meta: {
            AffectedNodes: [
              {
                ModifiedNode: {
                  LedgerEntryType: 'AccountRoot',
                  FinalFields: { Balance: '1000000' },
                },
              },
            ],
          },
          date: 827617760,
        },
      ],
    })

    const result = await getDeletedAMMData(mockSocket, 'rSomeAccount')
    expect(result).toBeNull()
  })

  it('returns null when account_tx returns no transactions', async () => {
    getAccountTransactions.mockResolvedValue({ transactions: [] })

    const result = await getDeletedAMMData(mockSocket, 'rSomeAccount')
    expect(result).toBeNull()
  })

  it('returns null when account_tx returns undefined', async () => {
    getAccountTransactions.mockResolvedValue(undefined)

    const result = await getDeletedAMMData(mockSocket, 'rSomeAccount')
    expect(result).toBeNull()
  })

  it('returns null when meta has no AffectedNodes', async () => {
    getAccountTransactions.mockResolvedValue({
      transactions: [
        {
          tx: { TransactionType: 'AMMWithdraw' },
          meta: {},
          date: 827617760,
        },
      ],
    })

    const result = await getDeletedAMMData(mockSocket, 'rSomeAccount')
    expect(result).toBeNull()
  })

  it('returns null when AccountDelete (not AMM deletion)', async () => {
    getAccountTransactions.mockResolvedValue({
      transactions: [
        {
          tx: { TransactionType: 'AccountDelete' },
          meta: {
            AffectedNodes: [
              {
                DeletedNode: {
                  LedgerEntryType: 'AccountRoot',
                  FinalFields: { Account: 'rDeletedAccount' },
                },
              },
            ],
          },
          date: 827617760,
        },
      ],
    })

    const result = await getDeletedAMMData(mockSocket, 'rDeletedAccount')
    expect(result).toBeNull()
  })
})

describe('formatDepositWithdraw', () => {
  const baseTx: LOSAMMDepositWithdrawRaw = {
    hash: 'ABC123',
    ledger_index: 100,
    timestamp: 1000000,
    account: 'rAccount1',
    amm: {
      asset1: { currency: 'USD', issuer: 'rIssuer1', value: '500' },
      asset2: { currency: 'XRP', issuer: null, value: '250' },
      lp_tokens_received: '1000',
      value_usd: 750,
    },
  }

  it('formats both assets preserving response order', () => {
    const result = formatDepositWithdraw(baseTx)

    expect(result.hash).toBe('ABC123')
    expect(result.ledger).toBe(100)
    expect(result.timestamp).toBe(1000000)
    expect(result.account).toBe('rAccount1')
    expect(result.asset).toEqual({
      currency: 'USD',
      issuer: 'rIssuer1',
      amount: 500,
    })
    expect(result.asset2).toEqual({
      currency: 'XRP',
      issuer: undefined,
      amount: 250,
    })
    expect(result.lpTokens).toBe('1000')
    expect(result.valueUsd).toBe(750)
  })

  it('returns null for missing asset2 (single-asset deposit)', () => {
    const singleAssetTx: LOSAMMDepositWithdrawRaw = {
      ...baseTx,
      amm: {
        asset1: { currency: 'USD', issuer: 'rIssuer1', value: '500' },
        lp_tokens_received: '1000',
      },
    }
    const result = formatDepositWithdraw(singleAssetTx)

    expect(result.asset).toEqual({
      currency: 'USD',
      issuer: 'rIssuer1',
      amount: 500,
    })
    expect(result.asset2).toBeNull()
  })

  it('returns null for asset with zero value', () => {
    const zeroAssetTx: LOSAMMDepositWithdrawRaw = {
      ...baseTx,
      amm: {
        asset1: { currency: 'USD', issuer: 'rIssuer1', value: '500' },
        asset2: { currency: 'XRP', issuer: null, value: '0' },
        lp_tokens_received: '1000',
      },
    }
    const result = formatDepositWithdraw(zeroAssetTx)

    expect(result.asset).toEqual({
      currency: 'USD',
      issuer: 'rIssuer1',
      amount: 500,
    })
    expect(result.asset2).toBeNull()
  })

  it('uses lp_tokens_redeemed for withdrawals', () => {
    const withdrawTx: LOSAMMDepositWithdrawRaw = {
      ...baseTx,
      amm: {
        asset1: { currency: 'USD', issuer: 'rIssuer1', value: '500' },
        lp_tokens_redeemed: '800',
      },
    }
    const result = formatDepositWithdraw(withdrawTx)

    expect(result.lpTokens).toBe('800')
  })

  it('returns null for lpTokens and valueUsd when amm data is missing', () => {
    const noAmmTx: LOSAMMDepositWithdrawRaw = {
      ...baseTx,
      amm: undefined,
    }
    const result = formatDepositWithdraw(noAmmTx)

    expect(result.asset).toBeNull()
    expect(result.asset2).toBeNull()
    expect(result.lpTokens).toBeNull()
    expect(result.valueUsd).toBeNull()
  })
})
