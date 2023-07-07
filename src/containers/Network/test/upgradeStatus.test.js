import { aggregateData } from '../UpgradeStatus'

describe('UpgradeStatus test functions', () => {
  const undefinedValidatorsData = [
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

  const nodesData = [
    {
      node_public_key: 'n9JoeT8XKeBSR8y4D9aDz2PL1DD1j6LQwkRTbH2eFqeRmWYHj2Nw',
      networks: 'dev',
      complete_ledgers: '22085270-29882772',
      ip: '34.208.12.148',
      port: 2459,
      uptime: 1257336,
      version: '1.11.0-rc3',
      server_state: 'full',
      io_latency_ms: 1,
      load_factor_server: '256',
      inbound_count: 4,
      outbound_count: 9,
      lat: '45.82',
      long: '-119.73',
      country_code: 'US',
      country: 'United States',
      region: 'Oregon',
      region_code: 'OR',
      city: 'Boardman',
      postal_code: '97818',
      timezone: 'America/Los_Angeles',
    },
  ]

  it('aggregateData handle edge case', () => {
    expect(aggregateData(undefinedValidatorsData, nodesData)).toEqual([
      {
        label: '1.9.4',
        validatorsCount: 1,
        validatorsPercent: 100,
        nodesCount: 0,
        nodesPercent: 0,
      },
      {
        label: '1.11.0-rc3',
        validatorsCount: 0,
        validatorsPercent: 0,
        nodesCount: 1,
        nodesPercent: 100,
      },
    ])
  })
})
