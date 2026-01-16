import { createSimpleRenderFactory } from '../../test/createWrapperFactory'
import { Simple } from '../Simple'
import { expectSimpleRowText, expectSimpleRowNotToExist } from '../../test'
import transactionSuccess from './mock_data/MPTokenAuthorize.json'
import transactionFail from './mock_data/MPTokenAuthorize_Fail.json'
import transactionWithHolder from './mock_data/MPTokenAuthorize_WithHolder.json'
import transactionWithHolderFail from './mock_data/MPTokenAuthorize_WithHolderFail.json'

const renderComponent = createSimpleRenderFactory(Simple)

describe('MPTokenAuthorize', () => {
  it('handles MPTokenAuthorize w/o holder simple view ', () => {
    const { container, unmount } = renderComponent(transactionSuccess)

    expectSimpleRowText(
      container,
      'mpt-issuance-id',
      '000005F398B624EBD06822198649C920C8B20ADB8EBE745E',
    )
    expectSimpleRowNotToExist(container, 'mpt-holder')
    unmount()
  })

  it('handles MPTokenAuthorize view w/ holder simple view ', () => {
    const { container, unmount } = renderComponent(transactionWithHolder)

    expectSimpleRowText(
      container,
      'mpt-issuance-id',
      '0000130B63FC523E33FDF4D1318D8D484B0D1111098CFD0B',
    )
    expectSimpleRowText(
      container,
      'mpt-holder',
      'rK3bB9myvWoMaLbLnpksGx2Zz58BL225am',
    )
    unmount()
  })

  it('handles failed MPTokenAuthorize view w/ holder simple view ', () => {
    const { container, unmount } = renderComponent(transactionWithHolderFail)

    expectSimpleRowText(
      container,
      'mpt-issuance-id',
      '00000F76D46440EE21F74E5B2398315BC1CFEB9A7EB48A14',
    )
    expectSimpleRowText(
      container,
      'mpt-holder',
      'rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh',
    )
    unmount()
  })

  it('handles failed MPTokenAuthorize w/o holder simple view ', () => {
    const { container, unmount } = renderComponent(transactionFail)
    expectSimpleRowText(
      container,
      'mpt-issuance-id',
      '0000098410531B842DEECCF4ABB1268C931EB71D9F6A1B64',
    )
    expectSimpleRowNotToExist(container, 'mpt-holder')
    unmount()
  })
})
