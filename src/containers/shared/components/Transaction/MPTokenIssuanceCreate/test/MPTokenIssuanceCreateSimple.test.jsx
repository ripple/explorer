import { createSimpleRenderFactory } from '../../test/createWrapperFactory'
import { Simple } from '../Simple'
import { expectSimpleRowText } from '../../test'
import transactionSuccess from './mock_data/MPTokenIssuanceCreate.json'

const renderComponent = createSimpleRenderFactory(Simple)

describe('MPTokenIssuanceCreate', () => {
  it('handles MPTokenIssuanceCreate simple view ', () => {
    const { container, unmount } = renderComponent(transactionSuccess)

    expectSimpleRowText(
      container,
      'mpt-issuance-id',
      '0000157844C3F3B57A8B579FEE1033CC8E8498729D063617',
    )
    expectSimpleRowText(container, 'mpt-asset-scale', '2')
    expectSimpleRowText(container, 'mpt-max-amount', '9223372036854775807')
    expectSimpleRowText(
      container,
      'mpt-metadata',
      'https://ipfs.io/ipfs/QmZnjmB9Tk4xaA9E679ytrPXda3beWMLUnMB5RFj1eStLp',
    )
    expectSimpleRowText(container, 'mpt-fee', '0.010%')
    unmount()
  })
})
