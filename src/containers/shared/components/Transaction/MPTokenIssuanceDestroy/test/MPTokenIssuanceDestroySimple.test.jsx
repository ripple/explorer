import { createSimpleWrapperFactory } from '../../test/createWrapperFactory'
import { Simple } from '../Simple'
import { expectSimpleRowText, expectSimpleRowNotToExist } from '../../test'
import transactionSuccess from './mock_data/MPTokenIssuanceDestroy.json'
import transactionFail from './mock_data/MPTokenIssuanceDestroy_Fail.json'

const createWrapper = createSimpleWrapperFactory(Simple)

describe('MPTokenIssuanceDestroy', () => {
  it('handles MPTokenIssuanceDestroy simple view ', () => {
    const wrapper = createWrapper(transactionSuccess)
    expectSimpleRowText(
      wrapper,
      'mpt-issuance-id',
      '0000071E15A457415B9A921957CA1958F0E3B8A049BE8627',
    )
    wrapper.unmount()
  })

  it('handles failed MPTokenIssuanceDestroy simple view ', () => {
    const wrapper = createWrapper(transactionFail)
    expectSimpleRowText(
      wrapper,
      'mpt-issuance-id',
      '0000097E2ACB52C693EABBB156034140B2ED5E9522C4ACF4',
    )
    wrapper.unmount()
  })
})
