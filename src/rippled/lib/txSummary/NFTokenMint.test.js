import NFTokenMint from './NFTokenMint'

describe('NFTokenMint txSummary', () => {
  it('parses the correct values for a simple transaction resulting in a single new NFTokenPage being created', () => {
    const tx = {
      tx: {
        Account: 'rDUbAKGzBRs3ztKpfMiWUAB5nwtcmrnRVe',
        Fee: '12',
        Flags: 8,
        LastLedgerSequence: 5605248,
        NFTokenTaxon: 1,
        Sequence: 5605209,
        SigningPubKey:
          '022DAC45B8CC7B217C47A04957A6DF7FE2C8E4BA485808FCBBFC82E115260E1C32',
        TransactionType: 'NFTokenMint',
        TxnSignature:
          '3045022100CF7620E25E4763FDC8746CEFAB250C2A6DB67FA581B58CAC928331A92C7661BB0220640A34137AC525CDA0D28A0E2B2832A418516C8B9CF1CFE36A8FC3AA966A66F1',
        URI: '68747470733A2F2F677265677765697362726F642E636F6D',
        date: '2022-09-13T20:44:40Z',
      },
      meta: {
        AffectedNodes: [
          {
            ModifiedNode: {
              FinalFields: {
                Account: 'rDUbAKGzBRs3ztKpfMiWUAB5nwtcmrnRVe',
                Balance: '9999999988',
                Flags: 0,
                MintedNFTokens: 1,
                OwnerCount: 1,
                Sequence: 5605210,
              },
              LedgerEntryType: 'AccountRoot',
              LedgerIndex:
                '433D9E7BE08CC6D929AE1AE85150F8FADCE098529C41BD134A47DEA255D0DAAC',
              PreviousFields: {
                Balance: '10000000000',
                OwnerCount: 0,
                Sequence: 5605209,
              },
              PreviousTxnID:
                'EBCF09070D88E39E9C830355AEDA0F412E14345F08F29ED15EBFF2F4CA4500C2',
              PreviousTxnLgrSeq: 5605209,
            },
          },
          {
            CreatedNode: {
              LedgerEntryType: 'NFTokenPage',
              LedgerIndex:
                '85D33F9C5481D3515029C9904D16F0109414D3A0FFFFFFFFFFFFFFFFFFFFFFFF',
              NewFields: {
                NFTokens: [
                  {
                    NFToken: {
                      NFTokenID:
                        '0008000085D33F9C5481D3515029C9904D16F0109414D3A00000099A00000000',
                      URI: '68747470733A2F2F677265677765697362726F642E636F6D',
                    },
                  },
                ],
              },
            },
          },
        ],
        TransactionIndex: 1,
        TransactionResult: 'tesSUCCESS',
      },
      hash: 'B0AAA46053F2570200CA1E12978EFFBB124374276669CC3F68602A6788182172',
      ledger_index: 5605230,
      date: '2022-09-13T20:44:40Z',
    }

    const parsed = NFTokenMint(tx.tx, tx.meta)

    expect(parsed.tokenID).toEqual(
      '0008000085D33F9C5481D3515029C9904D16F0109414D3A00000099A00000000',
    )
    expect(parsed.tokenTaxon).toEqual(1)
    expect(parsed.uri).toEqual('https://gregweisbrod.com')
  })

  it('parses the correct values for a complex transaction resulting in an existing NFTokenPage being split into two', () => {
    const tx = {
      tx: {
        Account: 'rDUbAKGzBRs3ztKpfMiWUAB5nwtcmrnRVe',
        Fee: '12',
        Flags: 8,
        LastLedgerSequence: 5605307,
        NFTokenTaxon: 1,
        Sequence: 5605241,
        SigningPubKey:
          '022DAC45B8CC7B217C47A04957A6DF7FE2C8E4BA485808FCBBFC82E115260E1C32',
        TransactionType: 'NFTokenMint',
        TxnSignature:
          '30440220623FB22FE14ED40690333A9B53DA7547CC38B75128B922B5EDA0FB1E7B8642F30220363B6A61A3B7F2A02F3202A67D97B1635576EBEE8465DD3A72E88DC3DFAE38E1',
        URI: '68747470733A2F2F677265677765697362726F642E636F6D',
        date: '2022-09-13T20:47:41Z',
      },
      meta: {
        AffectedNodes: [
          {
            ModifiedNode: {
              FinalFields: {
                Account: 'rDUbAKGzBRs3ztKpfMiWUAB5nwtcmrnRVe',
                Balance: '9999999604',
                Flags: 0,
                MintedNFTokens: 33,
                OwnerCount: 2,
                Sequence: 5605242,
              },
              LedgerEntryType: 'AccountRoot',
              LedgerIndex:
                '433D9E7BE08CC6D929AE1AE85150F8FADCE098529C41BD134A47DEA255D0DAAC',
              PreviousFields: {
                Balance: '9999999616',
                MintedNFTokens: 32,
                OwnerCount: 1,
                Sequence: 5605241,
              },
              PreviousTxnID:
                '44003568EB431E295D741C3FB98EB5525AD5203288FFB23B15DEB46899317D0B',
              PreviousTxnLgrSeq: 5605232,
            },
          },
          {
            CreatedNode: {
              LedgerEntryType: 'NFTokenPage',
              LedgerIndex:
                '85D33F9C5481D3515029C9904D16F0109414D3A09414D3A08122E5B60000001C',
              NewFields: {
                NFTokens: [
                  {
                    NFToken: {
                      NFTokenID:
                        '0008000085D33F9C5481D3515029C9904D16F0109414D3A00000099A00000000',
                      URI: '68747470733A2F2F677265677765697362726F642E636F6D',
                    },
                  },
                  {
                    NFToken: {
                      NFTokenID:
                        '0008000085D33F9C5481D3515029C9904D16F0109414D3A00EA5D0B300000017',
                      URI: '68747470733A2F2F677265677765697362726F642E636F6D',
                    },
                  },
                  {
                    NFToken: {
                      NFTokenID:
                        '0008000085D33F9C5481D3515029C9904D16F0109414D3A012C5D5A60000000C',
                      URI: '68747470733A2F2F677265677765697362726F642E636F6D',
                    },
                  },
                  {
                    NFToken: {
                      NFTokenID:
                        '0008000085D33F9C5481D3515029C9904D16F0109414D3A016E5DA9D00000001',
                      URI: '68747470733A2F2F677265677765697362726F642E636F6D',
                    },
                  },
                  {
                    NFToken: {
                      NFTokenID:
                        '0008000085D33F9C5481D3515029C9904D16F0109414D3A0258BA1B200000018',
                      URI: '68747470733A2F2F677265677765697362726F642E636F6D',
                    },
                  },
                  {
                    NFToken: {
                      NFTokenID:
                        '0008000085D33F9C5481D3515029C9904D16F0109414D3A029ABA6A90000000D',
                      URI: '68747470733A2F2F677265677765697362726F642E636F6D',
                    },
                  },
                  {
                    NFToken: {
                      NFTokenID:
                        '0008000085D33F9C5481D3515029C9904D16F0109414D3A02DCBAB9C00000002',
                      URI: '68747470733A2F2F677265677765697362726F642E636F6D',
                    },
                  },
                  {
                    NFToken: {
                      NFTokenID:
                        '0008000085D33F9C5481D3515029C9904D16F0109414D3A03C7172B500000019',
                      URI: '68747470733A2F2F677265677765697362726F642E636F6D',
                    },
                  },
                  {
                    NFToken: {
                      NFTokenID:
                        '0008000085D33F9C5481D3515029C9904D16F0109414D3A0409177A80000000E',
                      URI: '68747470733A2F2F677265677765697362726F642E636F6D',
                    },
                  },
                  {
                    NFToken: {
                      NFTokenID:
                        '0008000085D33F9C5481D3515029C9904D16F0109414D3A044B17C9F00000003',
                      URI: '68747470733A2F2F677265677765697362726F642E636F6D',
                    },
                  },
                  {
                    NFToken: {
                      NFTokenID:
                        '0008000085D33F9C5481D3515029C9904D16F0109414D3A0535743B40000001A',
                      URI: '68747470733A2F2F677265677765697362726F642E636F6D',
                    },
                  },
                  {
                    NFToken: {
                      NFTokenID:
                        '0008000085D33F9C5481D3515029C9904D16F0109414D3A0577748AB0000000F',
                      URI: '68747470733A2F2F677265677765697362726F642E636F6D',
                    },
                  },
                  {
                    NFToken: {
                      NFTokenID:
                        '0008000085D33F9C5481D3515029C9904D16F0109414D3A05B974D9E00000004',
                      URI: '68747470733A2F2F677265677765697362726F642E636F6D',
                    },
                  },
                  {
                    NFToken: {
                      NFTokenID:
                        '0008000085D33F9C5481D3515029C9904D16F0109414D3A06A3D14B70000001B',
                      URI: '68747470733A2F2F677265677765697362726F642E636F6D',
                    },
                  },
                  {
                    NFToken: {
                      NFTokenID:
                        '0008000085D33F9C5481D3515029C9904D16F0109414D3A06E5D19AA00000010',
                      URI: '68747470733A2F2F677265677765697362726F642E636F6D',
                    },
                  },
                  {
                    NFToken: {
                      NFTokenID:
                        '0008000085D33F9C5481D3515029C9904D16F0109414D3A0727D1EA100000005',
                      URI: '68747470733A2F2F677265677765697362726F642E636F6D',
                    },
                  },
                ],
                NextPageMin:
                  '85D33F9C5481D3515029C9904D16F0109414D3A0FFFFFFFFFFFFFFFFFFFFFFFF',
              },
            },
          },
          {
            ModifiedNode: {
              FinalFields: {
                Flags: 0,
                NFTokens: [
                  {
                    NFToken: {
                      NFTokenID:
                        '0008000085D33F9C5481D3515029C9904D16F0109414D3A08122E5B60000001C',
                      URI: '68747470733A2F2F677265677765697362726F642E636F6D',
                    },
                  },
                  {
                    NFToken: {
                      NFTokenID:
                        '0008000085D33F9C5481D3515029C9904D16F0109414D3A08542EAAD00000011',
                      URI: '68747470733A2F2F677265677765697362726F642E636F6D',
                    },
                  },
                  {
                    NFToken: {
                      NFTokenID:
                        '0008000085D33F9C5481D3515029C9904D16F0109414D3A08962EFA000000006',
                      URI: '68747470733A2F2F677265677765697362726F642E636F6D',
                    },
                  },
                  {
                    NFToken: {
                      NFTokenID:
                        '0008000085D33F9C5481D3515029C9904D16F0109414D3A09808B6B90000001D',
                      URI: '68747470733A2F2F677265677765697362726F642E636F6D',
                    },
                  },
                  {
                    NFToken: {
                      NFTokenID:
                        '0008000085D33F9C5481D3515029C9904D16F0109414D3A09C28BBAC00000012',
                      URI: '68747470733A2F2F677265677765697362726F642E636F6D',
                    },
                  },
                  {
                    NFToken: {
                      NFTokenID:
                        '0008000085D33F9C5481D3515029C9904D16F0109414D3A0A048C0A300000007',
                      URI: '68747470733A2F2F677265677765697362726F642E636F6D',
                    },
                  },
                  {
                    NFToken: {
                      NFTokenID:
                        '0008000085D33F9C5481D3515029C9904D16F0109414D3A0AEEE87B80000001E',
                      URI: '68747470733A2F2F677265677765697362726F642E636F6D',
                    },
                  },
                  {
                    NFToken: {
                      NFTokenID:
                        '0008000085D33F9C5481D3515029C9904D16F0109414D3A0B30E8CAF00000013',
                      URI: '68747470733A2F2F677265677765697362726F642E636F6D',
                    },
                  },
                  {
                    NFToken: {
                      NFTokenID:
                        '0008000085D33F9C5481D3515029C9904D16F0109414D3A0B72E91A200000008',
                      URI: '68747470733A2F2F677265677765697362726F642E636F6D',
                    },
                  },
                  {
                    NFToken: {
                      NFTokenID:
                        '0008000085D33F9C5481D3515029C9904D16F0109414D3A0C5D458BB0000001F',
                      URI: '68747470733A2F2F677265677765697362726F642E636F6D',
                    },
                  },
                  {
                    NFToken: {
                      NFTokenID:
                        '0008000085D33F9C5481D3515029C9904D16F0109414D3A0C9F45DAE00000014',
                      URI: '68747470733A2F2F677265677765697362726F642E636F6D',
                    },
                  },
                  {
                    NFToken: {
                      NFTokenID:
                        '0008000085D33F9C5481D3515029C9904D16F0109414D3A0CE1462A500000009',
                      URI: '68747470733A2F2F677265677765697362726F642E636F6D',
                    },
                  },
                  {
                    NFToken: {
                      NFTokenID:
                        '0008000085D33F9C5481D3515029C9904D16F0109414D3A0DCBA29BA00000020',
                      URI: '68747470733A2F2F677265677765697362726F642E636F6D',
                    },
                  },
                  {
                    NFToken: {
                      NFTokenID:
                        '0008000085D33F9C5481D3515029C9904D16F0109414D3A0E0DA2EB100000015',
                      URI: '68747470733A2F2F677265677765697362726F642E636F6D',
                    },
                  },
                  {
                    NFToken: {
                      NFTokenID:
                        '0008000085D33F9C5481D3515029C9904D16F0109414D3A0E4FA33A40000000A',
                      URI: '68747470733A2F2F677265677765697362726F642E636F6D',
                    },
                  },
                  {
                    NFToken: {
                      NFTokenID:
                        '0008000085D33F9C5481D3515029C9904D16F0109414D3A0F7BFFFB000000016',
                      URI: '68747470733A2F2F677265677765697362726F642E636F6D',
                    },
                  },
                  {
                    NFToken: {
                      NFTokenID:
                        '0008000085D33F9C5481D3515029C9904D16F0109414D3A0FBE004A70000000B',
                      URI: '68747470733A2F2F677265677765697362726F642E636F6D',
                    },
                  },
                ],
                PreviousPageMin:
                  '85D33F9C5481D3515029C9904D16F0109414D3A09414D3A08122E5B60000001C',
              },
              LedgerEntryType: 'NFTokenPage',
              LedgerIndex:
                '85D33F9C5481D3515029C9904D16F0109414D3A0FFFFFFFFFFFFFFFFFFFFFFFF',
              PreviousFields: {
                NFTokens: [
                  {
                    NFToken: {
                      NFTokenID:
                        '0008000085D33F9C5481D3515029C9904D16F0109414D3A00000099A00000000',
                      URI: '68747470733A2F2F677265677765697362726F642E636F6D',
                    },
                  },
                  {
                    NFToken: {
                      NFTokenID:
                        '0008000085D33F9C5481D3515029C9904D16F0109414D3A00EA5D0B300000017',
                      URI: '68747470733A2F2F677265677765697362726F642E636F6D',
                    },
                  },
                  {
                    NFToken: {
                      NFTokenID:
                        '0008000085D33F9C5481D3515029C9904D16F0109414D3A012C5D5A60000000C',
                      URI: '68747470733A2F2F677265677765697362726F642E636F6D',
                    },
                  },
                  {
                    NFToken: {
                      NFTokenID:
                        '0008000085D33F9C5481D3515029C9904D16F0109414D3A016E5DA9D00000001',
                      URI: '68747470733A2F2F677265677765697362726F642E636F6D',
                    },
                  },
                  {
                    NFToken: {
                      NFTokenID:
                        '0008000085D33F9C5481D3515029C9904D16F0109414D3A0258BA1B200000018',
                      URI: '68747470733A2F2F677265677765697362726F642E636F6D',
                    },
                  },
                  {
                    NFToken: {
                      NFTokenID:
                        '0008000085D33F9C5481D3515029C9904D16F0109414D3A029ABA6A90000000D',
                      URI: '68747470733A2F2F677265677765697362726F642E636F6D',
                    },
                  },
                  {
                    NFToken: {
                      NFTokenID:
                        '0008000085D33F9C5481D3515029C9904D16F0109414D3A02DCBAB9C00000002',
                      URI: '68747470733A2F2F677265677765697362726F642E636F6D',
                    },
                  },
                  {
                    NFToken: {
                      NFTokenID:
                        '0008000085D33F9C5481D3515029C9904D16F0109414D3A03C7172B500000019',
                      URI: '68747470733A2F2F677265677765697362726F642E636F6D',
                    },
                  },
                  {
                    NFToken: {
                      NFTokenID:
                        '0008000085D33F9C5481D3515029C9904D16F0109414D3A0409177A80000000E',
                      URI: '68747470733A2F2F677265677765697362726F642E636F6D',
                    },
                  },
                  {
                    NFToken: {
                      NFTokenID:
                        '0008000085D33F9C5481D3515029C9904D16F0109414D3A044B17C9F00000003',
                      URI: '68747470733A2F2F677265677765697362726F642E636F6D',
                    },
                  },
                  {
                    NFToken: {
                      NFTokenID:
                        '0008000085D33F9C5481D3515029C9904D16F0109414D3A0535743B40000001A',
                      URI: '68747470733A2F2F677265677765697362726F642E636F6D',
                    },
                  },
                  {
                    NFToken: {
                      NFTokenID:
                        '0008000085D33F9C5481D3515029C9904D16F0109414D3A0577748AB0000000F',
                      URI: '68747470733A2F2F677265677765697362726F642E636F6D',
                    },
                  },
                  {
                    NFToken: {
                      NFTokenID:
                        '0008000085D33F9C5481D3515029C9904D16F0109414D3A05B974D9E00000004',
                      URI: '68747470733A2F2F677265677765697362726F642E636F6D',
                    },
                  },
                  {
                    NFToken: {
                      NFTokenID:
                        '0008000085D33F9C5481D3515029C9904D16F0109414D3A06A3D14B70000001B',
                      URI: '68747470733A2F2F677265677765697362726F642E636F6D',
                    },
                  },
                  {
                    NFToken: {
                      NFTokenID:
                        '0008000085D33F9C5481D3515029C9904D16F0109414D3A06E5D19AA00000010',
                      URI: '68747470733A2F2F677265677765697362726F642E636F6D',
                    },
                  },
                  {
                    NFToken: {
                      NFTokenID:
                        '0008000085D33F9C5481D3515029C9904D16F0109414D3A0727D1EA100000005',
                      URI: '68747470733A2F2F677265677765697362726F642E636F6D',
                    },
                  },
                  {
                    NFToken: {
                      NFTokenID:
                        '0008000085D33F9C5481D3515029C9904D16F0109414D3A08122E5B60000001C',
                      URI: '68747470733A2F2F677265677765697362726F642E636F6D',
                    },
                  },
                  {
                    NFToken: {
                      NFTokenID:
                        '0008000085D33F9C5481D3515029C9904D16F0109414D3A08542EAAD00000011',
                      URI: '68747470733A2F2F677265677765697362726F642E636F6D',
                    },
                  },
                  {
                    NFToken: {
                      NFTokenID:
                        '0008000085D33F9C5481D3515029C9904D16F0109414D3A08962EFA000000006',
                      URI: '68747470733A2F2F677265677765697362726F642E636F6D',
                    },
                  },
                  {
                    NFToken: {
                      NFTokenID:
                        '0008000085D33F9C5481D3515029C9904D16F0109414D3A09808B6B90000001D',
                      URI: '68747470733A2F2F677265677765697362726F642E636F6D',
                    },
                  },
                  {
                    NFToken: {
                      NFTokenID:
                        '0008000085D33F9C5481D3515029C9904D16F0109414D3A09C28BBAC00000012',
                      URI: '68747470733A2F2F677265677765697362726F642E636F6D',
                    },
                  },
                  {
                    NFToken: {
                      NFTokenID:
                        '0008000085D33F9C5481D3515029C9904D16F0109414D3A0A048C0A300000007',
                      URI: '68747470733A2F2F677265677765697362726F642E636F6D',
                    },
                  },
                  {
                    NFToken: {
                      NFTokenID:
                        '0008000085D33F9C5481D3515029C9904D16F0109414D3A0AEEE87B80000001E',
                      URI: '68747470733A2F2F677265677765697362726F642E636F6D',
                    },
                  },
                  {
                    NFToken: {
                      NFTokenID:
                        '0008000085D33F9C5481D3515029C9904D16F0109414D3A0B30E8CAF00000013',
                      URI: '68747470733A2F2F677265677765697362726F642E636F6D',
                    },
                  },
                  {
                    NFToken: {
                      NFTokenID:
                        '0008000085D33F9C5481D3515029C9904D16F0109414D3A0B72E91A200000008',
                      URI: '68747470733A2F2F677265677765697362726F642E636F6D',
                    },
                  },
                  {
                    NFToken: {
                      NFTokenID:
                        '0008000085D33F9C5481D3515029C9904D16F0109414D3A0C5D458BB0000001F',
                      URI: '68747470733A2F2F677265677765697362726F642E636F6D',
                    },
                  },
                  {
                    NFToken: {
                      NFTokenID:
                        '0008000085D33F9C5481D3515029C9904D16F0109414D3A0C9F45DAE00000014',
                      URI: '68747470733A2F2F677265677765697362726F642E636F6D',
                    },
                  },
                  {
                    NFToken: {
                      NFTokenID:
                        '0008000085D33F9C5481D3515029C9904D16F0109414D3A0CE1462A500000009',
                      URI: '68747470733A2F2F677265677765697362726F642E636F6D',
                    },
                  },
                  {
                    NFToken: {
                      NFTokenID:
                        '0008000085D33F9C5481D3515029C9904D16F0109414D3A0E0DA2EB100000015',
                      URI: '68747470733A2F2F677265677765697362726F642E636F6D',
                    },
                  },
                  {
                    NFToken: {
                      NFTokenID:
                        '0008000085D33F9C5481D3515029C9904D16F0109414D3A0E4FA33A40000000A',
                      URI: '68747470733A2F2F677265677765697362726F642E636F6D',
                    },
                  },
                  {
                    NFToken: {
                      NFTokenID:
                        '0008000085D33F9C5481D3515029C9904D16F0109414D3A0F7BFFFB000000016',
                      URI: '68747470733A2F2F677265677765697362726F642E636F6D',
                    },
                  },
                  {
                    NFToken: {
                      NFTokenID:
                        '0008000085D33F9C5481D3515029C9904D16F0109414D3A0FBE004A70000000B',
                      URI: '68747470733A2F2F677265677765697362726F642E636F6D',
                    },
                  },
                ],
              },
              PreviousTxnID:
                '44003568EB431E295D741C3FB98EB5525AD5203288FFB23B15DEB46899317D0B',
              PreviousTxnLgrSeq: 5605232,
            },
          },
        ],
        TransactionIndex: 0,
        TransactionResult: 'tesSUCCESS',
      },
      hash: 'C4E598099A8B13C5C8D2B8C86385A37B64C2F62BFA1FB87196401BB6ACB67A69',
      ledger_index: 5605289,
      date: '2022-09-13T20:47:41Z',
    }

    const parsed = NFTokenMint(tx.tx, tx.meta)

    expect(parsed.tokenID).toEqual(
      '0008000085D33F9C5481D3515029C9904D16F0109414D3A0DCBA29BA00000020',
    )
    expect(parsed.tokenTaxon).toEqual(1)
    expect(parsed.uri).toEqual('https://gregweisbrod.com')
  })
})
