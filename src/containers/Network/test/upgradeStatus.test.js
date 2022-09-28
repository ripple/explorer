import { aggregateData } from '../UpgradeStatus'

describe('UpgradeStatus test functions', () => {
  const undefinedData = [
    {
      ledger_index: 74661353,
      ledger_hash:
        '613E298A8C0AEB816D16AA61952E0834BBD9B5E5677EA3E9A2413118EE074363',
    },
    {
      master_key: 'nHUakYHufAvdx5XqTS2F4Pu7i8fQqDqpKqXN2kUGHhBFcG38GNqL',
      signing_key: 'n9M38x7Sf7epp3gaxgcFxEtwkSc4w2ePb1SgfLiz9bVCr5Lvzrm8',
      unl: false,
      domain: 'gerty.one',
      ledger_index: 74554449,
      server_version: '1.9.4',
      agreement_1hour: {
        missed: 936,
        total: 936,
        score: '0.00000',
        incomplete: false,
      },
      agreement_24hour: {
        missed: 22338,
        total: 22338,
        score: '0.00000',
        incomplete: false,
      },
      agreement_30day: {
        missed: 263139,
        total: 535427,
        score: '0.50854',
        incomplete: false,
      },
      chain: 'chain.4',
      partial: false,
    },
  ]

  it('aggregarteData handle edge case', () => {
    expect(aggregateData(undefinedData)).toEqual([
      { count: 1, label: '1.9.4', value: 100 },
    ])
  })
})
