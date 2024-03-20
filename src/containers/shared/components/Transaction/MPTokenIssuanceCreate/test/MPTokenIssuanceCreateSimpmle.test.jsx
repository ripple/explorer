import { createSimpleWrapperFactory } from '../../test/createWrapperFactory'
import { Simple } from '../Simple'
import { expectSimpleRowText, expectSimpleRowNotToExist } from '../../test'

const createWrapper = createSimpleWrapperFactory(Simple)

describe('NFTokenAcceptOffer', () => {
  it('handles NFTokenAcceptOffer Buy simple view ', () => {
    const wrapper = createWrapper(transactionBuy)

    expectSimpleRowText(
      wrapper,
      'mpt_issuance_id',
      '0000157844C3F3B57A8B579FEE1033CC8E8498729D063617',
    )
    expectSimpleRowText(
      wrapper,
      'mpt-asset-scale',
      '2',
    )
    expectSimpleRowText(
      wrapper,
      'mpt-max-amount',
      '1000',
    )
    wrapper.unmount()
  })


  it('handles NFTokenAcceptOffer Sell Failure simple view ', () => {
    const wrapper = createWrapper(transactionFailure)

    expectSimpleRowText(
      wrapper,
      'offer-id',
      '17AFFE8C8D94554EB3A31A517B05C16085777FAEA9ACEDDCDE9D7CFD7B988D01',
    )
    expectSimpleRowNotToExist(wrapper, 'token-id')
    expectSimpleRowNotToExist(wrapper, 'amount')
    expectSimpleRowNotToExist(wrapper, 'buyer')
    expectSimpleRowNotToExist(wrapper, 'seller')
    wrapper.unmount()
  })

})
