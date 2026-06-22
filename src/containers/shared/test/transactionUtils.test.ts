import { Transaction } from '../components/Transaction/types'
import { buildFlags } from '../transactionUtils'

const buildNFTokenMint = (flags: number): Transaction =>
  ({
    tx: {
      TransactionType: 'NFTokenMint',
      Flags: flags,
    },
  }) as unknown as Transaction

describe('transactionUtils buildFlags', () => {
  it('decodes NFTokenMint type-specific flags', () => {
    expect(buildFlags(buildNFTokenMint(0x00000001))).toEqual(['tfBurnable'])
    expect(buildFlags(buildNFTokenMint(0x00000008))).toEqual(['tfTransferable'])
  })

  it('decodes the tfMutable flag (XLS-46 dynamic NFTs)', () => {
    expect(buildFlags(buildNFTokenMint(0x00000010))).toEqual(['tfMutable'])
  })

  it('decodes multiple NFTokenMint flags including tfMutable', () => {
    expect(
      buildFlags(buildNFTokenMint(0x00000001 | 0x00000008 | 0x00000010)),
    ).toEqual(['tfMutable', 'tfTransferable', 'tfBurnable'])
  })
})
