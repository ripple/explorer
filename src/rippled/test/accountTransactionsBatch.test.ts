import getAccountTransactions from '../accountTransactions'
import BatchMPT from '../../containers/shared/components/Transaction/Batch/test/mock_data/BatchMPT.json'

// Uses the real formatter and summarizer: a Batch's summary drops its inner
// transactions, which is what the filter has to work around
jest.mock('../lib/rippled', () => ({
  getAccountTransactions: jest.fn(),
}))

jest.mock('../lib/logger', () => () => ({
  info: jest.fn(),
  error: jest.fn(),
}))

// eslint-disable-next-line @typescript-eslint/no-require-imports
const mockGetAccountTxs = require('../lib/rippled').getAccountTransactions

describe('accountTransactions with a real Batch', () => {
  const ISSUER = 'rMgkHzJ6UpnhxmemPxVMi8ob63kY57JH4h'
  const MPT_ID = '014BAF7CE2E6E09523A4EE29CED6EBF52DF4E31BD21E562D'

  beforeEach(() => {
    mockGetAccountTxs.mockResolvedValue({ transactions: [BatchMPT] })
  })

  it('keeps a Batch whose inner transactions reference the MPT', async () => {
    const result = await getAccountTransactions(
      ISSUER,
      MPT_ID,
      undefined,
      20,
      {} as any,
    )

    expect(result.transactions.map((tx: any) => tx.hash)).toEqual([
      BatchMPT.tx.hash,
    ])
    expect(result.transactions[0].type).toBe('Batch')
  })

  it("doesn't check an IOU's Batch inner transactions, as on main", async () => {
    // The same Batch, with its inner Payment sending an IOU instead
    const iouBatch = JSON.parse(JSON.stringify(BatchMPT))
    iouBatch.tx.RawTransactions[1].RawTransaction.Amount = {
      currency: 'USD',
      issuer: ISSUER,
      value: '1',
    }
    mockGetAccountTxs.mockResolvedValue({ transactions: [iouBatch] })

    const result = await getAccountTransactions(
      ISSUER,
      'USD',
      undefined,
      20,
      {} as any,
    )

    expect(result.transactions).toHaveLength(0)
  })

  it('drops the Batch for an unrelated MPT', async () => {
    const result = await getAccountTransactions(
      ISSUER,
      '00000001FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF',
      undefined,
      20,
      {} as any,
    )

    expect(result.transactions).toHaveLength(0)
  })
})
