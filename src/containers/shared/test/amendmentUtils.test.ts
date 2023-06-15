import { getRippledVersion, nameOfAmendmentID } from '../amendmentUtils'

const nameTable = [
  [
    '32A122F1352A4C7B3A6D790362CC34749C5E57FCE896377BFDC6CCD14F6CD627',
    'NonFungibleTokensV1_1',
  ],
  [
    '4C97EBA926031A7CF7D7B36FDE3ED66DDA5421192D63DE53FFB46E43B9DC8373',
    'MultiSign',
  ],
  [
    '6781F8368C4771B83E8B821D88F580202BCB4228075297B19E4FDC5233F1EFDC',
    'TrustSetAuth',
  ],
  [
    '42426C4D4F1009EE67080A9B7965B44656D7714D104A72F9B4369F97ABF044EE',
    'FeeEscalation',
  ],
  [
    '08DE7D96082187F6E6578530258C77FAABABE4C20474BDB82F04B021F1A68647',
    'PayChan',
  ],
  ['740352F2412A9909880C23A559FCECEDA3BE2126FED62FC7660D628A06927F11', 'Flow'],
  [
    '1562511F573A19AE9BD103B5D6B9E01B3B46805AEC5D3C4805C902B514399146',
    'CryptoConditions',
  ],
  [
    '532651B4FD58DF8922A49BA101AB3E996E5BFBF95A913B3E392504863E63B164',
    'TickSize',
  ],
  [
    'E2E6F2866106419B88C50045ACE96368558C345566AC8F2BDF5A5B5587F0E6FA',
    'fix1368',
  ],
  [
    '07D43DCE529B15A10827E5E04943B496762F9A88E3268269D69C44BE49E21104',
    'Escrow',
  ],
  [
    '86E83A7D2ECE3AD5FA87AB2195AE015C950469ABF0B72EAACED318F74886AE90',
    'CryptoConditionsSuite',
  ],
  [
    '42EEA5E28A97824821D4EF97081FE36A54E9593C6E4F20CBAE098C69D2E072DC',
    'fix1373',
  ],
  [
    'DC9CA96AEA1DCF83E527D1AFC916EFAF5D27388ECA4060A88817C1238CAEE0BF',
    'EnforceInvariants',
  ],
  [
    '3012E8230864E95A58C60FD61430D7E1B4D3353195F2981DC12B0C7C0950FFAC',
    'FlowCross',
  ],
  [
    'CC5ABAE4F3EC92E94A59B1908C2BE82D2228B6485C00AFF8F22DF930D89C194E',
    'SortedDirectories',
  ],
  [
    'B4D44CC3111ADD964E846FC57760C8B50FFCD5A82C86A72756F6B058DDDF96AD',
    'fix1201',
  ],
  [
    '6C92211186613F9647A89DFFBAB8F94C99D4C7E956D495270789128569177DA1',
    'fix1512',
  ],
  [
    '67A34F2CF55BFC0F93AACD5B281413176FEE195269FA6D95219A2DF738671172',
    'fix1513',
  ],
  [
    'B9E739B8296B4A1BB29BE990B17D66E21B62A300A909F25AC55C22D6C72E1F9D',
    'fix1523',
  ],
  [
    '1D3463A5891F9E589C5AE839FFAC4A917CE96197098A1EF22304E1BC5B98A454',
    'fix1528',
  ],
  [
    'F64E1EABBE79D55B3BB82020516CEC2C582A98A6BFE20FBE9BB6A0D233418064',
    'DepositAuth',
  ],
  [
    '157D2D480E006395B76F948E3E07A45A05FE10230D88A7993C71F97AE4B1F2D1',
    'Checks',
  ],
  [
    '7117E2EC2DBF119CA55181D69819F1999ECEE1A0225A7FD2B9ED47940968479C',
    'fix1571',
  ],
  [
    'CA7C02118BA27599528543DFE77BA6838D1B0F43B447D4D7F53523CE6A0E9AC2',
    'fix1543',
  ],
  [
    '58BE9B5968C4DA7C59BA900961828B113E5490699B21877DEF9A31E9D0FE5D5F',
    'fix1623',
  ],
  [
    '3CBC5C4E630A1B82380295CDA84B32B49DD066602E74E39B85EF64137FA65194',
    'DepositPreauth',
  ],
  [
    '5D08145F0A4983F23AFFFF514E83FAD355C5ABFBB6CAB76FB5BC8519FF5F33BE',
    'fix1515',
  ],
  [
    'FBD513F1B893AC765B78F250E6FFA6A11B573209D1842ADC787C850696741288',
    'fix1578',
  ],
  [
    '586480873651E106F1D6339B0C4A8945BA705A777F3F4524626FF1FC07EFE41D',
    'MultiSignReserve',
  ],
  [
    '2CD5286D8D687E98B41102BDD797198E81EA41DF7BD104E6561FEB104EFF2561',
    'fixTakerDryOfferRemoval',
  ],
  [
    'C4483A1896170C66C098DEA5B0E024309C60DC960DE5F01CD7AF986AA3D9AD37',
    'fixMasterKeyAsRegularKey',
  ],
  [
    '8F81B066ED20DAECA20DF57187767685EEF3980B228E0667A650BAF24426D3B4',
    'fixCheckThreading',
  ],
  [
    '621A0B264970359869E3C0363A899909AAB7A887C8B73519E4ECF952D33258A8',
    'fixPayChanRecipientOwnerDir',
  ],
  [
    '30CD365592B8EE40489BA01AE2F7555CAC9C983145871DC82A42A31CF5BAE7D9',
    'DeletableAccounts',
  ],
  [
    '89308AF3B8B10B7192C4E613E1D2E4D9BA64B2EE2D5232402AE82A6A7220D953',
    'fixQualityUpperBound',
  ],
  [
    '00C1FC4A53E60AB02C864641002B3172F38677E29C26C5406685179B37E1EDAC',
    'RequireFullyCanonicalSig',
  ],
  [
    '25BA44241B3BD880770BFA4DA21C7180576831855368CBEC6A3154FDE4A7676E',
    'fix1781',
  ],
  [
    '1F4AFA8FA1BC8827AD4C0F682C03A8B671DCDF6B5C4DE36D44243A684103EF88',
    'HardenedValidations',
  ],
  [
    '4F46DF03559967AC60F2EB272FEFE3928A7594A45FF774B87A7E540DB0F8F068',
    'fixAmendmentMajorityCalc',
  ],
]

describe('nameOfAmendmentID: ', () => {
  it.each(nameTable)(
    `should resolve amendment id "%s" to "%s"`,
    async (id, name) => {
      const retrievedName = await nameOfAmendmentID(id)
      return expect(retrievedName).toEqual(name)
    },
  )
})

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
