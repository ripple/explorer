import { createSimpleWrapperFactory } from '../../test/createWrapperFactory'
import { Simple } from '../Simple'
import { expectSimpleRowText, expectSimpleRowNotToExist } from '../../test'
import transactionSuccess from './mock_data/MPTokenIssuanceCreate.json'

const createWrapper = createSimpleWrapperFactory(Simple)

describe('MPTokenIssuanceCreate', () => {
  it('handles MPTokenIssuanceCreate simple view ', () => {
    const wrapper = createWrapper(transactionSuccess)

    expectSimpleRowText(
      wrapper,
      'mpt-issuance-id',
      '0000157844C3F3B57A8B579FEE1033CC8E8498729D063617',
    )
    expectSimpleRowText(wrapper, 'mpt-asset-scale', '2')
    expectSimpleRowText(wrapper, 'mpt-max-amount', '9223372036854775807')
    expectSimpleRowText(
      wrapper,
      'mpt-metadata',
      'https://ipfs.io/ipfs/QmZnjmB9Tk4xaA9E679ytrPXda3beWMLUnMB5RFj1eStLp',
    )
    expectSimpleRowText(wrapper, 'mpt-fee', '0.010%')
    wrapper.unmount()
  })
})
