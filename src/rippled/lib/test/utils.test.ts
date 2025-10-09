import { formatAccountInfo, formatNFTInfo, formatTransferFee } from '../utils'

describe('rippled utils:', () => {
  describe('formatNFTInfo', () => {
    const oldResponse: any = {
      nft_id:
        '0000000025CC40A6A240DB42512BA22826B903A785EE2FA512C5D5A70000000C',
      ledger_index: 2436210,
      owner: 'rhSigFwZ9UnbiKbpaco8aSQUsNFXJVz51W',
      is_burned: true,
      flags: 3,
      transfer_fee: 10,
      issuer: 'rhSigFwZ9UnbiKbpaco8aSQUsNFXJVz51W',
      nft_taxon: 0,
      nft_sequence: 12,
      uri: 'ipfs://bafybeigdyrzt5sfp7udm7hu76uh7y26nf4dfuylqabf3oclgtqy55fbzdi',
      validated: true,
      status: 'success',
      warnings: [
        "This is a clio server. clio only serves validated data. If you want to talk to rippled, include 'ledger_index':'current' in your request",
      ],
      minted: undefined,
      domain: '123456',
    }

    const newResponse = Object.assign(oldResponse, {
      nft_serial: 12,
      uri: '697066733A2F2F62616679626569676479727A74357366703775646D37687537367568377932366E6634646675796C71616266336F636C67747179353566627A6469',
    })

    delete newResponse.nft_sequence

    it('should format uri and serial on clio <= 1.0.4', () => {
      const result = formatNFTInfo(oldResponse)

      expect(result.NFTId).toEqual(
        '0000000025CC40A6A240DB42512BA22826B903A785EE2FA512C5D5A70000000C',
      )
      expect(result.isBurned).toEqual(true)
      expect(result.transferFee).toEqual(10)
      expect(result.flags).toEqual(['lsfOnlyXRP', 'lsfBurnable'])
      expect(result.NFTSerial).toEqual(12)
      expect(result.NFTTaxon).toEqual(0)
      expect(result.uri).toEqual(
        'ipfs://bafybeigdyrzt5sfp7udm7hu76uh7y26nf4dfuylqabf3oclgtqy55fbzdi',
      )
    })
    it('should format uri and serial on clio > 1.0.4', () => {
      const result = formatNFTInfo(newResponse)

      expect(result.NFTSerial).toEqual(12)
      expect(result.uri).toEqual(
        'ipfs://bafybeigdyrzt5sfp7udm7hu76uh7y26nf4dfuylqabf3oclgtqy55fbzdi',
      )
    })
  })

  describe('formatAccountInfo', () => {
    const accountInfoData: any = {
      Account: 'rDb2kD2sibG5cxhz3VAoRFkmhPrca4JtL8',
      Balance: '99999975',
      Flags: 1082130432,
      LedgerEntryType: 'AccountRoot',
      OwnerCount: 0,
      PreviousTxnID:
        '6174EDD6109E08874F2B7D039084BB2612458D6E4EA26ADE55B10E2B013C2766',
      PreviousTxnLgrSeq: 4469249,
      Sequence: 4467999,
      index: 'A24328E84D9B832F75195C5D100F4AFABB03BF2CD8BF2687354BD933BFBAE353',
    }

    const serverInfoValidatedLedger: any = {
      age: 2,
      base_fee_xrp: 1e-6,
      hash: '5C68F56D909EF82D0D0BA59A783854ACEE390CF70630AF1B7E238FC448E48741',
      reserve_base_xrp: 1,
      reserve_inc_xrp: 0.2,
      seq: 4545199,
    }

    it('validate flags', () => {
      const result = formatAccountInfo(
        accountInfoData,
        serverInfoValidatedLedger,
      )

      expect(result.flags.sort()).toEqual(
        ['lsfDefaultRipple', 'lsfAllowTrustLineLocking'].sort(),
      )
    })
  })

  describe('formatTransferFee', () => {
    describe('when no transfer fee is provided', () => {
      it('should return "0" for null', () => {
        expect(formatTransferFee(null)).toBe('0')
      })

      it('should return "0" for undefined', () => {
        expect(formatTransferFee(undefined)).toBe('0')
      })

      it('should return "0" for 0', () => {
        expect(formatTransferFee(0)).toBe('0')
      })
    })

    describe('when tokenType is "IOU"', () => {
      it('should calculate percentage for IOU tokens using billion-based formula', () => {
        // 0.5% transfer fee: 1000000000 + (1000000000 * 0.005) = 1005000000
        expect(formatTransferFee(1005000000, 'IOU')).toBe('0.5')

        // 10% transfer fee: 1000000000 + (1000000000 * 0.1) = 1100000000
        expect(formatTransferFee(1100000000, 'IOU')).toBe('10')
      })

      it('should handle high precision values for IOU tokens', () => {
        // Test with a value that needs rounding to 7 decimal places
        const transferFee = 1000000000 + 12345678 // should result in 1.2345678%
        expect(formatTransferFee(transferFee, 'IOU')).toBe('1.2345678')
      })

      it('should handle very small transfer fees for IOU tokens', () => {
        const billion = 1000000000
        const transferFee = billion + 1 // 0.0000001%
        expect(formatTransferFee(transferFee, 'IOU')).toBe('1e-7') // JavaScript converts very small numbers to scientific notation
      })
    })

    describe('when tokenType is "MPT" or "NFT"', () => {
      it('should calculate percentage for MPT tokens using thousand-based formula', () => {
        // 0.5% transfer fee
        expect(formatTransferFee(5, 'MPT')).toBe('0.005')

        // 10% transfer fee
        expect(formatTransferFee(100, 'MPT')).toBe('0.1')
      })

      it('should calculate percentage for NFT tokens using thousand-based formula', () => {
        expect(formatTransferFee(5, 'NFT')).toBe('0.005')
        expect(formatTransferFee(100, 'NFT')).toBe('0.1')
      })

      it('should handle high precision values for MPT/NFT tokens', () => {
        // Test with a value that needs rounding to 3 decimal places
        expect(formatTransferFee(1234, 'MPT')).toBe('1.234')
        expect(formatTransferFee(1235, 'NFT')).toBe('1.235') // Test rounding
      })

      it('should handle very small transfer fees for MPT/NFT tokens', () => {
        expect(formatTransferFee(1, 'MPT')).toBe('0.001')
        expect(formatTransferFee(0.5, 'NFT')).toBe('0.001') // Should round to 3 decimal places
      })
    })

    describe('edge cases', () => {
      it('should throw error for unsupported token types', () => {
        expect(() => formatTransferFee(100, 'XRP')).toThrow(
          'Unsupported Token type: XRP',
        )
        expect(() => formatTransferFee(100, 'INVALID')).toThrow(
          'Unsupported Token type: INVALID',
        )
        expect(() => formatTransferFee(100, '')).toThrow(
          'Unsupported Token type: ',
        )
        expect(() => formatTransferFee(100, null)).toThrow(
          'Unsupported Token type: null',
        )
      })
    })
  })
})
