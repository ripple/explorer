import { cleanup, screen } from '@testing-library/react'
import { Simple } from '../Simple'
import { createSimpleRenderFactory, expectSimpleRowText } from '../../test'
import transactionSuccess from './mock_data/MPTokenIssuanceCreate.json'

const renderComponent = createSimpleRenderFactory(Simple)

describe('MPTokenIssuanceCreate', () => {
  afterEach(cleanup)
  it('handles MPTokenIssuanceCreate simple view ', () => {
    renderComponent(transactionSuccess)

    expectSimpleRowText(
      screen,
      'mpt-issuance-id',
      '0000157844C3F3B57A8B579FEE1033CC8E8498729D063617',
    )
    expectSimpleRowText(screen, 'mpt-asset-scale', '2')
    expectSimpleRowText(screen, 'mpt-max-amount', '9223372036854775807')
    expectSimpleRowText(
      screen,
      'mpt-metadata',
      'https://ipfs.io/ipfs/QmZnjmB9Tk4xaA9E679ytrPXda3beWMLUnMB5RFj1eStLp',
    )
    expectSimpleRowText(screen, 'mpt-fee', '0.010%')
  })
})
