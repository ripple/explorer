import { createSimpleRenderFactory } from '../../test/createWrapperFactory'
import { Simple } from '../Simple'
import { expectSimpleRowText, expectSimpleRowNotToExist } from '../../test'
import transactionSuccess from './mock_data/MPTokenIssuanceSet.json'
import transactionNoHolder from './mock_data/MPTokenIssuanceSet_NoHolder.json'
import transactionFail from './mock_data/MPTokenIssuanceSet_Fail.json'

const renderComponent = createSimpleRenderFactory(Simple)

describe('MPTokenIssuanceSet', () => {
  it('handles MPTokenIssuanceSet simple view ', () => {
    const { container, unmount } = renderComponent(transactionSuccess)

    expectSimpleRowText(
      container,
      'mpt-issuance-id',
      '00000BED9E4ADA3DCC1BE78683C4B623A74013818160590C',
    )
    expectSimpleRowText(
      container,
      'mpt-holder',
      'r9hF4e3e6kLuxLobPwfQa2wzXZMDvBDeUg',
    )
    unmount()
  })

  it('handles MPTokenIssuanceSet simple view w/o holder ', () => {
    const { container, unmount } = renderComponent(transactionNoHolder)

    expectSimpleRowText(
      container,
      'mpt-issuance-id',
      '000002609BB39CEC721B5AB337B6BD862ACD2811CBBB5F18',
    )
    expectSimpleRowNotToExist(container, 'mpt-holder')
    unmount()
  })

  it('handles failed MPTokenIssuanceSet simple view ', () => {
    const { container, unmount } = renderComponent(transactionFail)
    expectSimpleRowText(
      container,
      'mpt-issuance-id',
      '00000F83146C83112AED215CD345F8E7327459BFCF6B8062',
    )
    expectSimpleRowText(
      container,
      'mpt-holder',
      'rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh',
    )
    unmount()
  })
})
