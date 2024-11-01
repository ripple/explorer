import { cleanup, screen } from '@testing-library/react'
import { Simple } from '../Simple'
import {
  createSimpleRenderFactory,
  expectSimpleRowText,
  expectSimpleRowNotToExist,
} from '../../test'
import transactionSuccess from './mock_data/MPTokenAuthorize.json'
import transactionFail from './mock_data/MPTokenAuthorize_Fail.json'
import transactionWithHolder from './mock_data/MPTokenAuthorize_WithHolder.json'
import transactionWithHolderFail from './mock_data/MPTokenAuthorize_WithHolderFail.json'

const renderComponent = createSimpleRenderFactory(Simple)

describe('MPTokenAuthorize', () => {
  afterEach(cleanup)
  it('handles MPTokenAuthorize w/o holder simple view ', () => {
    renderComponent(transactionSuccess)

    expectSimpleRowText(
      screen,
      'mpt-issuance-id',
      '000005F398B624EBD06822198649C920C8B20ADB8EBE745E',
    )
    expectSimpleRowNotToExist(screen, 'mpt-holder')
  })

  it('handles MPTokenAuthorize view w/ holder simple view ', () => {
    renderComponent(transactionWithHolder)

    expectSimpleRowText(
      screen,
      'mpt-issuance-id',
      '0000130B63FC523E33FDF4D1318D8D484B0D1111098CFD0B',
    )
    expectSimpleRowText(
      screen,
      'mpt-holder',
      'rK3bB9myvWoMaLbLnpksGx2Zz58BL225am',
    )
  })

  it('handles failed MPTokenAuthorize view w/ holder simple view ', () => {
    renderComponent(transactionWithHolderFail)

    expectSimpleRowText(
      screen,
      'mpt-issuance-id',
      '00000F76D46440EE21F74E5B2398315BC1CFEB9A7EB48A14',
    )
    expectSimpleRowText(
      screen,
      'mpt-holder',
      'rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh',
    )
  })

  it('handles failed MPTokenAuthorize w/o holder simple view ', () => {
    renderComponent(transactionFail)
    expectSimpleRowText(
      screen,
      'mpt-issuance-id',
      '0000098410531B842DEECCF4ABB1268C931EB71D9F6A1B64',
    )
    expectSimpleRowNotToExist(screen, 'mpt-holder')
  })
})
