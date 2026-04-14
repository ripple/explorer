import { findAssetAmount, findNodes, LedgerEntryTypes } from '../metaParser'

const TEST_MPT_ID = '000003C31D321B7DDA58324DC38CDF18934FAFFFCDF69D5F'

describe('findAssetAmount', () => {
  const baseTx = { Account: 'rTestAccount', Fee: '12' } as any

  it('finds XRP amount from AccountRoot', () => {
    const meta = {
      AffectedNodes: [
        {
          ModifiedNode: {
            LedgerEntryType: 'AccountRoot',
            LedgerIndex: 'ABC123',
            FinalFields: {
              Account: 'rTestAccount',
              Balance: '990000000',
            },
            PreviousFields: {
              Balance: '1000000000',
            },
          },
        },
      ],
    }
    const result = findAssetAmount(meta, { currency: 'XRP' }, baseTx)
    expect(result).toBeDefined()
    expect(result!.currency).toBe('XRP')
    // Balance change is 10000000, fee is 12, so amount = (10000000 - 12) / 1000000
    expect(result!.amount).toBeGreaterThan(0)
  })

  it('finds IOU amount from RippleState', () => {
    const meta = {
      AffectedNodes: [
        {
          ModifiedNode: {
            LedgerEntryType: 'RippleState',
            LedgerIndex: 'DEF456',
            FinalFields: {
              Balance: {
                currency: 'USD',
                issuer: 'rrrrrrrrrrrrrrrrrrrrBZbvji',
                value: '-990000',
              },
            },
            PreviousFields: {
              Balance: {
                currency: 'USD',
                issuer: 'rrrrrrrrrrrrrrrrrrrrBZbvji',
                value: '-1000000',
              },
            },
          },
        },
      ],
    }
    const result = findAssetAmount(
      meta,
      { currency: 'USD', issuer: 'rIssuer' },
      baseTx,
    )
    expect(result).toBeDefined()
    expect(result!.currency).toBe('USD')
    expect(result!.amount).toBe(10000)
  })

  it('finds MPT amount from MPToken', () => {
    const meta = {
      AffectedNodes: [
        {
          ModifiedNode: {
            LedgerEntryType: 'MPToken',
            LedgerIndex: 'GHI789',
            FinalFields: {
              Account: 'rTestAccount',
              MPTokenIssuanceID:
                TEST_MPT_ID,
              MPTAmount: '990000',
            },
            PreviousFields: {
              MPTAmount: '1000000',
            },
          },
        },
      ],
    }
    const result = findAssetAmount(
      meta,
      {
        mpt_issuance_id: TEST_MPT_ID,
      },
      baseTx,
    )
    expect(result).toBeDefined()
    expect(result!.currency).toBe(
      TEST_MPT_ID,
    )
    expect(result!.amount).toBe(10000)
    expect(result!.isMPT).toBe(true)
  })

  it('returns undefined for MPT when no matching MPToken node exists', () => {
    const meta = {
      AffectedNodes: [
        {
          ModifiedNode: {
            LedgerEntryType: 'AccountRoot',
            LedgerIndex: 'ABC123',
            FinalFields: {
              Account: 'rTestAccount',
              Balance: '999999988',
            },
            PreviousFields: { Balance: '1000000000' },
          },
        },
      ],
    }
    const result = findAssetAmount(
      meta,
      {
        mpt_issuance_id: TEST_MPT_ID,
      },
      baseTx,
    )
    expect(result).toBeUndefined()
  })

  it('finds MPT amount from newly created MPToken', () => {
    const meta = {
      AffectedNodes: [
        {
          CreatedNode: {
            LedgerEntryType: 'MPToken',
            LedgerIndex: 'JKL012',
            NewFields: {
              Account: 'rTestAccount',
              MPTokenIssuanceID:
                TEST_MPT_ID,
              MPTAmount: '5000',
            },
          },
        },
      ],
    }
    const result = findAssetAmount(
      meta,
      {
        mpt_issuance_id: TEST_MPT_ID,
      },
      baseTx,
    )
    expect(result).toBeDefined()
    expect(result!.amount).toBe(5000)
    expect(result!.isMPT).toBe(true)
  })
})

describe('findNodes', () => {
  it('finds MPToken nodes', () => {
    const meta = {
      AffectedNodes: [
        {
          ModifiedNode: {
            LedgerEntryType: 'MPToken',
            LedgerIndex: 'ABC',
            FinalFields: { MPTAmount: '100' },
          },
        },
        {
          ModifiedNode: {
            LedgerEntryType: 'AccountRoot',
            LedgerIndex: 'DEF',
            FinalFields: { Balance: '1000' },
          },
        },
      ],
    }
    const nodes = findNodes(meta, LedgerEntryTypes.MPToken)
    expect(nodes).toHaveLength(1)
    expect(nodes[0].FinalFields.MPTAmount).toBe('100')
  })
})
