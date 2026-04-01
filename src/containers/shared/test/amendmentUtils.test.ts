import { getRippledVersion } from '../amendmentUtils'

const versionTable = [
  ['NonFungibleTokensV1_1', '1.9.2'],
  ['fixAmendmentMajorityCalc', '1.6.0'],
  ['HardenedValidations', '1.6.0'],
  ['fix1781', '1.6.0'],
  ['FlowCross', '0.70.0'],
  ['fixQualityUpperBound', '1.5.0'],
  ['RequireFullyCanonicalSig', '1.5.0'],
  ['Checks', '0.90.0'],
  ['DeletableAccounts', '1.4.0'],
  ['fixCheckThreading', '1.4.0'],
  ['fixPayChanRecipientOwnerDir', '1.4.0'],
  ['fixMasterKeyAsRegularKey', '1.3.1'],
  ['MultiSignReserve', '1.2.0'],
  ['fixTakerDryOfferRemoval', '1.2.0'],
  ['fix1578', '1.2.0'],
  ['DepositPreauth', '1.1.0'],
  ['fix1515', '1.1.0'],
  ['fix1543', '1.0.0'],
  ['fix1623', '1.0.0'],
  ['fix1571', '1.0.0'],
  ['DepositAuth', '0.90.0'],
  ['fix1513', '0.90.0'],
  ['fix1201', '0.80.0'],
  ['fix1512', '0.80.0'],
  ['fix1523', '0.80.0'],
  ['fix1528', '0.80.0'],
  ['SortedDirectories', '0.80.0'],
  ['EnforceInvariants', '0.70.0'],
  ['fix1373', '0.70.0'],
  ['Escrow', '0.60.0'],
  ['fix1368', '0.60.0'],
  ['PayChan', '0.33.0'],
  ['TickSize', '0.50.0'],
  ['CryptoConditions', '0.50.0'],
  ['Flow', '0.33.0'],
  ['TrustSetAuth', '0.30.0'],
  ['MultiSign', '0.31.0'],
  ['FeeEscalation', '0.31.0'],
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
