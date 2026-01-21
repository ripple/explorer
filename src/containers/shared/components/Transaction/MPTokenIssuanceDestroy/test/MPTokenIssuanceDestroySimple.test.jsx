import { createSimpleRenderFactory } from '../../test/createWrapperFactory'
import { Simple } from '../Simple'
import { expectSimpleRowText } from '../../test'
import transactionSuccess from './mock_data/MPTokenIssuanceDestroy.json'
import transactionFail from './mock_data/MPTokenIssuanceDestroy_Fail.json'

const renderComponent = createSimpleRenderFactory(Simple)

describe('MPTokenIssuanceDestroy', () => {
  it('handles MPTokenIssuanceDestroy simple view ', () => {
    const { container, unmount } = renderComponent(transactionSuccess)
    expectSimpleRowText(
      container,
      'mpt-issuance-id',
      '0000071E15A457415B9A921957CA1958F0E3B8A049BE8627',
    )
    unmount()
  })

  it('handles failed MPTokenIssuanceDestroy simple view ', () => {
    const { container, unmount } = renderComponent(transactionFail)
    expectSimpleRowText(
      container,
      'mpt-issuance-id',
      '0000097E2ACB52C693EABBB156034140B2ED5E9522C4ACF4',
    )
    unmount()
  })
})
