import getAccountTransactions from '../accountTransactions'

// Mock dependencies
jest.mock('../lib/rippled', () => ({
  getAccountTransactions: jest.fn(),
  getTransaction: jest.fn(),
}))

jest.mock('../lib/utils', () => ({
  formatTransaction: (tx: any) => tx,
}))

jest.mock('../lib/txSummary', () => (tx: any) => tx)

jest.mock('../lib/logger', () => () => ({
  info: jest.fn(),
  error: jest.fn(),
}))

// eslint-disable-next-line @typescript-eslint/no-require-imports
const mockGetAccountTxs = require('../lib/rippled').getAccountTransactions
// eslint-disable-next-line @typescript-eslint/no-require-imports
const mockGetTransaction = require('../lib/rippled').getTransaction

describe('accountTransactions', () => {
  const mockSocket = {} as any
  const validAccount = 'rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh'

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return all transactions when no currency filter is applied', async () => {
    const mockTxs = {
      transactions: [
        { hash: 'tx1', type: 'Payment', currency: 'XRP' },
        { hash: 'tx2', type: 'Payment', currency: 'USD', issuer: 'rIssuer1' },
        {
          hash: 'tx3',
          type: 'MPTokenAuthorize',
          mpt_issuance_id: '00000001ABC123',
        },
      ],
      marker: '12345.1',
    }
    mockGetAccountTxs.mockResolvedValue(mockTxs)

    const result = await getAccountTransactions(
      validAccount,
      undefined, // no currency filter
      undefined,
      20,
      mockSocket,
    )

    expect(result.transactions).toHaveLength(3)
    expect(result.transactions[0].hash).toBe('tx1')
    expect(result.transactions[1].hash).toBe('tx2')
    expect(result.transactions[2].hash).toBe('tx3')
    expect(result.marker).toBe('12345.1')
  })

  it('should filter transactions by IOU currency', async () => {
    const mockTxs = {
      transactions: [
        { hash: 'tx1', type: 'Payment', currency: 'XRP' },
        { hash: 'tx2', type: 'Payment', currency: 'USD', issuer: 'rIssuer1' },
        { hash: 'tx3', type: 'Payment', currency: 'EUR', issuer: 'rIssuer2' },
      ],
      marker: undefined,
    }
    mockGetAccountTxs.mockResolvedValue(mockTxs)

    const result = await getAccountTransactions(
      validAccount,
      'usd', // filter by USD (lowercase to test case conversion)
      undefined,
      20,
      mockSocket,
    )

    expect(result.transactions).toHaveLength(1)
    expect(result.transactions[0].hash).toBe('tx2')
    expect(result.transactions[0].currency).toBe('USD')
  })

  it('should filter transactions by MPT issuance ID', async () => {
    const mptIssuanceId = '00000001ABC123DEF456'
    const mockTxs = {
      transactions: [
        { hash: 'tx1', type: 'Payment', currency: 'XRP' },
        { hash: 'tx2', type: 'Payment', currency: 'USD', issuer: 'rIssuer1' },
        {
          hash: 'tx3',
          type: 'MPTokenAuthorize',
          mpt_issuance_id: mptIssuanceId,
        },
        {
          hash: 'tx4',
          type: 'MPTokenIssuanceCreate',
          mpt_issuance_id: mptIssuanceId,
        },
      ],
      marker: undefined,
    }
    mockGetAccountTxs.mockResolvedValue(mockTxs)

    const result = await getAccountTransactions(
      validAccount,
      mptIssuanceId,
      undefined,
      20,
      mockSocket,
    )

    expect(result.transactions).toHaveLength(2)
    expect(result.transactions[0].hash).toBe('tx3')
    expect(result.transactions[1].hash).toBe('tx4')
  })

  describe('MPT creation', () => {
    const mptIssuanceId = '00000001ABC123DEF456'
    const createTx = (id: string) => ({
      hash: 'create',
      type: 'MPTokenIssuanceCreate',
      meta: { TransactionResult: 'tesSUCCESS', mpt_issuance_id: id },
    })

    it("stops paging at the MPT's creation", async () => {
      mockGetAccountTxs.mockResolvedValue({
        transactions: [createTx(mptIssuanceId)],
        marker: '12345.1',
      })

      const result = await getAccountTransactions(
        validAccount,
        mptIssuanceId,
        undefined,
        20,
        mockSocket,
      )

      expect(result.transactions).toHaveLength(1)
      expect(result.marker).toBeUndefined()
    })

    it('matches the creation regardless of ID case', async () => {
      mockGetAccountTxs.mockResolvedValue({
        transactions: [createTx(mptIssuanceId)],
        marker: '12345.1',
      })

      const result = await getAccountTransactions(
        validAccount,
        mptIssuanceId.toLowerCase(),
        undefined,
        20,
        mockSocket,
      )

      expect(result.marker).toBeUndefined()
    })

    it("keeps paging past another MPT's creation", async () => {
      mockGetAccountTxs.mockResolvedValue({
        transactions: [createTx('00000002FFFFFFFFFFFF')],
        marker: '12345.1',
      })

      const result = await getAccountTransactions(
        validAccount,
        mptIssuanceId,
        undefined,
        20,
        mockSocket,
      )

      expect(result.transactions).toHaveLength(0)
      expect(result.marker).toBe('12345.1')
    })

    it('keeps paging when no token filter is applied', async () => {
      mockGetAccountTxs.mockResolvedValue({
        transactions: [createTx(mptIssuanceId)],
        marker: '12345.1',
      })

      const result = await getAccountTransactions(
        validAccount,
        undefined,
        undefined,
        20,
        mockSocket,
      )

      expect(result.marker).toBe('12345.1')
    })
  })

  it.each([
    [true, '00000001ABC123DEF456'],
    [false, undefined],
  ])(
    'passes useP2P=%s and the MPT filter %s to the account_tx request',
    async (useP2P, mptFilter) => {
      mockGetAccountTxs.mockResolvedValue({ transactions: [] })

      await getAccountTransactions(
        validAccount,
        '00000001ABC123DEF456',
        '12345.1',
        50,
        mockSocket,
        useP2P,
      )

      expect(mockGetAccountTxs).toHaveBeenCalledWith(
        mockSocket,
        validAccount,
        50,
        '12345.1',
        useP2P,
        mptFilter,
      )
    },
  )

  describe('rows filtered by the server', () => {
    const mptIssuanceId = '00000001ABC123DEF456'

    it('keeps every row without filtering again', async () => {
      // A VaultDeposit only references the MPT in its metadata
      mockGetAccountTxs.mockResolvedValue({
        transactions: [{ hash: 'vault-deposit', type: 'VaultDeposit' }],
        filtered: true,
      })

      const result = await getAccountTransactions(
        validAccount,
        mptIssuanceId,
        undefined,
        20,
        mockSocket,
        true,
      )

      expect(result.transactions.map((tx: any) => tx.hash)).toEqual([
        'vault-deposit',
      ])
    })

    it('adds each parent Batch after its last inner transaction', async () => {
      const batch = { hash: 'batch', type: 'Batch' }
      mockGetTransaction.mockResolvedValue(batch)
      mockGetAccountTxs.mockResolvedValue({
        transactions: [
          { hash: 'inner-2', meta: { ParentBatchID: 'batch' } },
          { hash: 'inner-1', meta: { ParentBatchID: 'batch' } },
          { hash: 'other' },
        ],
        filtered: true,
      })

      const result = await getAccountTransactions(
        validAccount,
        mptIssuanceId,
        undefined,
        20,
        mockSocket,
        true,
      )

      expect(mockGetTransaction).toHaveBeenCalledTimes(1)
      expect(result.transactions.map((tx: any) => tx.hash)).toEqual([
        'inner-2',
        'inner-1',
        'batch',
        'other',
      ])
    })

    it('keeps the inner transactions when the Batch lookup fails', async () => {
      mockGetTransaction.mockRejectedValue(new Error('txnNotFound'))
      mockGetAccountTxs.mockResolvedValue({
        transactions: [{ hash: 'inner', meta: { ParentBatchID: 'batch' } }],
        filtered: true,
      })

      const result = await getAccountTransactions(
        validAccount,
        mptIssuanceId,
        undefined,
        20,
        mockSocket,
        true,
      )

      expect(result.transactions.map((tx: any) => tx.hash)).toEqual(['inner'])
    })
  })

  describe('Batch', () => {
    const mptIssuanceId = '00000001ABC123DEF456'
    // A Batch's summary keeps only its inner hashes, so its RawTransactions are
    // the only place the token appears
    const batchTx = (innerTxs: any[]) => ({
      hash: 'batch',
      summary: { batchTransactions: [{ hash: 'inner' }] },
      tx: {
        TransactionType: 'Batch',
        RawTransactions: innerTxs.map((RawTransaction) => ({
          RawTransaction,
        })),
      },
    })

    it('keeps a Batch whose inner transaction references the MPT', async () => {
      mockGetAccountTxs.mockResolvedValue({
        transactions: [
          batchTx([
            {
              TransactionType: 'MPTokenAuthorize',
              MPTokenIssuanceID: mptIssuanceId,
            },
          ]),
        ],
      })

      const result = await getAccountTransactions(
        validAccount,
        mptIssuanceId,
        undefined,
        20,
        mockSocket,
      )

      expect(result.transactions.map((tx: any) => tx.hash)).toEqual(['batch'])
    })

    it('keeps a Batch whose inner transaction uses the IOU', async () => {
      mockGetAccountTxs.mockResolvedValue({
        transactions: [
          batchTx([
            {
              TransactionType: 'Payment',
              Amount: { currency: 'USD', issuer: 'rIssuer1', value: '1' },
            },
          ]),
        ],
      })

      const result = await getAccountTransactions(
        validAccount,
        'usd',
        undefined,
        20,
        mockSocket,
      )

      expect(result.transactions.map((tx: any) => tx.hash)).toEqual(['batch'])
    })

    it('drops a Batch whose inner transactions are unrelated', async () => {
      mockGetAccountTxs.mockResolvedValue({
        transactions: [
          batchTx([
            {
              TransactionType: 'MPTokenAuthorize',
              MPTokenIssuanceID: '00000002FFFFFFFFFFFF',
            },
          ]),
        ],
      })

      const result = await getAccountTransactions(
        validAccount,
        mptIssuanceId,
        undefined,
        20,
        mockSocket,
      )

      expect(result.transactions).toHaveLength(0)
    })
  })
})
