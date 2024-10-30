import { cleanup, screen } from '@testing-library/react'
import { Simple } from '../Simple'
import {
  createSimpleRenderFactory,
  expectSimpleRowText,
  expectSimpleRowNotToExist,
} from '../../test'
import transactionSuccess from './mock_data/MPTokenIssuanceSet.json'
import transactionNoHolder from './mock_data/MPTokenIssuanceSet_NoHolder.json'
import transactionFail from './mock_data/MPTokenIssuanceSet_Fail.json'

const renderComponent = createSimpleRenderFactory(Simple)

describe('MPTokenIssuanceSet', () => {
  afterEach(cleanup)
  it('handles MPTokenIssuanceSet simple view ', () => {
    renderComponent(transactionSuccess)

    expectSimpleRowText(
      screen,
      'mpt-issuance-id',
      '00000BED9E4ADA3DCC1BE78683C4B623A74013818160590C',
    )
    expectSimpleRowText(
      screen,
      'mpt-holder',
      'r9hF4e3e6kLuxLobPwfQa2wzXZMDvBDeUg',
    )
  })

  it('handles MPTokenIssuanceSet simple view w/o holder ', () => {
    renderComponent(transactionNoHolder)

    expectSimpleRowText(
      screen,
      'mpt-issuance-id',
      '000002609BB39CEC721B5AB337B6BD862ACD2811CBBB5F18',
    )
    expectSimpleRowNotToExist(screen, 'mpt-holder')
  })

  it('handles failed MPTokenIssuanceSet simple view ', () => {
    renderComponent(transactionFail)
    expectSimpleRowText(
      screen,
      'mpt-issuance-id',
      '00000F83146C83112AED215CD345F8E7327459BFCF6B8062',
    )
    expectSimpleRowText(
      screen,
      'mpt-holder',
      'rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh',
    )
  })
})
