import { cleanup, screen } from '@testing-library/react'
import { Simple } from '../Simple'
import { createSimpleRenderFactory, expectSimpleRowText } from '../../test'
import transactionSuccess from './mock_data/MPTokenIssuanceDestroy.json'
import transactionFail from './mock_data/MPTokenIssuanceDestroy_Fail.json'

const renderComponent = createSimpleRenderFactory(Simple)

describe('MPTokenIssuanceDestroy', () => {
  afterEach(cleanup)
  it('handles MPTokenIssuanceDestroy simple view ', () => {
    renderComponent(transactionSuccess)
    expectSimpleRowText(
      screen,
      'mpt-issuance-id',
      '0000071E15A457415B9A921957CA1958F0E3B8A049BE8627',
    )
  })

  it('handles failed MPTokenIssuanceDestroy simple view ', () => {
    renderComponent(transactionFail)
    expectSimpleRowText(
      screen,
      'mpt-issuance-id',
      '0000097E2ACB52C693EABBB156034140B2ED5E9522C4ACF4',
    )
  })
})
