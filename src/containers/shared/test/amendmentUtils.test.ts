import { getRippledVersion } from '../amendmentUtils'

const versionTable = [
  ['NonFungibleTokensV1_1', 'v1.9.2'],
  ['fixAmendmentMajorityCalc', 'v1.6.0'],
  ['HardenedValidations', 'v1.6.0'],
  ['fix1781', 'v1.6.0'],
  ['FlowCross', 'v0.70.0'],
  ['fixQualityUpperBound', 'v1.5.0'],
  ['RequireFullyCanonicalSig', 'v1.5.0'],
  ['Checks', 'v0.90.0'],
  ['DeletableAccounts', 'v1.4.0'],
  ['fixCheckThreading', 'v1.4.0'],
  ['fixPayChanRecipientOwnerDir', 'v1.4.0'],
  ['fixMasterKeyAsRegularKey', 'v1.3.1'],
  ['MultiSignReserve', 'v1.2.0'],
  ['fixTakerDryOfferRemoval', 'v1.2.0'],
  ['fix1578', 'v1.2.0'],
  ['DepositPreauth', 'v1.1.0'],
  ['fix1515', 'v1.1.0'],
  ['fix1543', 'v1.0.0'],
  ['fix1623', 'v1.0.0'],
  ['fix1571', 'v1.0.0'],
  ['DepositAuth', 'v0.90.0'],
  ['fix1513', 'v0.90.0'],
  ['fix1201', 'v0.80.0'],
  ['fix1512', 'v0.80.0'],
  ['fix1523', 'v0.80.0'],
  ['fix1528', 'v0.80.0'],
  ['SortedDirectories', 'v0.80.0'],
  ['EnforceInvariants', 'v0.70.0'],
  ['fix1373', 'v0.70.0'],
  ['Escrow', 'v0.60.0'],
  ['fix1368', 'v0.60.0'],
  ['PayChan', 'v0.33.0'],
  ['TickSize', 'v0.50.0'],
  ['CryptoConditions', 'v0.50.0'],
  ['Flow', 'v0.33.0'],
  ['TrustSetAuth', 'v0.30.0'],
  ['MultiSign', 'v0.31.0'],
  ['FeeEscalation', 'v0.31.0'],
  ['SHAMapV2', 'v0.32.1'],
  ['FlowV2', 'v0.32.1'],
  ['SusPay', 'v0.31.0'],
]

describe('getRippledVersion:', () => {
  it.each(versionTable)(
    `should for amendment "%s" return the version "%s"`,
    async (name, expectedVersion) => {
      const retrievedVersion = await getRippledVersion(name)
      return expect(retrievedVersion).toEqual(expectedVersion)
    },
  )
})
