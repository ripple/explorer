import { getLiquidatedAMMData } from '../utils'
import mockLiquidatedTx from './mockLiquidatedAMMTransaction.json'

describe('getLiquidatedAMMData', () => {
  const mockSocket = {
    send: jest.fn(),
  } as any

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('returns liquidated AMM data when last tx has DeletedNode with LedgerEntryType AMM', async () => {
    mockSocket.send.mockResolvedValue(mockLiquidatedTx)

    const result = await getLiquidatedAMMData(
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
    expect(result!.liquidationDate).toBe(827617760)
  })

  it('calls account_tx with limit=1', async () => {
    mockSocket.send.mockResolvedValue(mockLiquidatedTx)

    await getLiquidatedAMMData(mockSocket, 'rQhuJV3eVEm6D6YreeisJkvfyBBA3qAXrL')

    expect(mockSocket.send).toHaveBeenCalledWith({
      command: 'account_tx',
      account: 'rQhuJV3eVEm6D6YreeisJkvfyBBA3qAXrL',
      limit: 1,
    })
  })

  it('returns null when last tx has no DeletedNode with AMM type', async () => {
    mockSocket.send.mockResolvedValue({
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

    const result = await getLiquidatedAMMData(mockSocket, 'rSomeAccount')
    expect(result).toBeNull()
  })

  it('returns null when account_tx returns no transactions', async () => {
    mockSocket.send.mockResolvedValue({ transactions: [] })

    const result = await getLiquidatedAMMData(mockSocket, 'rSomeAccount')
    expect(result).toBeNull()
  })

  it('returns null when account_tx returns undefined', async () => {
    mockSocket.send.mockResolvedValue(undefined)

    const result = await getLiquidatedAMMData(mockSocket, 'rSomeAccount')
    expect(result).toBeNull()
  })

  it('returns null when meta has no AffectedNodes', async () => {
    mockSocket.send.mockResolvedValue({
      transactions: [
        {
          tx: { TransactionType: 'AMMWithdraw' },
          meta: {},
          date: 827617760,
        },
      ],
    })

    const result = await getLiquidatedAMMData(mockSocket, 'rSomeAccount')
    expect(result).toBeNull()
  })

  it('returns null when AccountDelete (not AMM liquidation)', async () => {
    mockSocket.send.mockResolvedValue({
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

    const result = await getLiquidatedAMMData(mockSocket, 'rDeletedAccount')
    expect(result).toBeNull()
  })
})
