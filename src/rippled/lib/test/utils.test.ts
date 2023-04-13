import { describe, it, expect } from 'vitest'
import { formatNFTInfo } from '../utils'

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
})
