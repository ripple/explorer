import { createSimpleWrapperFactory } from '../../test/createWrapperFactory'
import { Simple } from '../Simple'
import { expectSimpleRowText, expectSimpleRowNotToExist } from '../../test'
import transactionSuccess from './mock_data/MPTokenIssuanceSet.json'
import transactionFail from './mock_data/MPTokenIssuanceSet_Fail.json'

const createWrapper = createSimpleWrapperFactory(Simple)

describe('MPTokenIssuanceSet', () => {
  it('handles MPTokenIssuanceSet simple view ', () => {
    const wrapper = createWrapper(transactionSuccess)

    expectSimpleRowText(
      wrapper,
      'mpt-issuance-id',
      '00000BED9E4ADA3DCC1BE78683C4B623A74013818160590C',
    )
    expectSimpleRowText(
      wrapper,
      'mpt-holder',
      'r9hF4e3e6kLuxLobPwfQa2wzXZMDvBDeUg',
    )
    wrapper.unmount()
  })

  it('handles failed MPTokenIssuanceSet simple view ', () => {
    const wrapper = createWrapper(transactionFail)
    expectSimpleRowText(
      wrapper,
      'mpt-issuance-id',
      '00000F83146C83112AED215CD345F8E7327459BFCF6B8062',
    )
    expectSimpleRowText(
      wrapper,
      'mpt-holder',
      'rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh',
    )
    wrapper.unmount()
  })
})
