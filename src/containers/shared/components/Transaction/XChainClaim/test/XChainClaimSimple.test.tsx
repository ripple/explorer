import { createSimpleRenderFactory, expectSimpleRowText } from '../../test'
import { Simple } from '../Simple'
import mockXChainClaim from './mock_data/XChainClaim.json'
import mockXChainClaimNoQuorum from './mock_data/XChainClaimNoQuorum.json'

const createWrapper = createSimpleRenderFactory(Simple)

describe('XChainClaimSimple', () => {
  it('renders', () => {
    const wrapper = createWrapper(mockXChainClaim)

    // check XChainBridge parts
    expectSimpleRowText(
      wrapper,
      'locking-chain-door',
      'rGQLcxzT3Po9PsCk5Lj9uK7S1juThii9cR',
    )
    expect(wrapper.find(`[data-testid="locking-chain-door"] a`)).not.toExist()
    expectSimpleRowText(wrapper, 'locking-chain-issue', '\uE900 XRP')
    expectSimpleRowText(
      wrapper,
      'issuing-chain-door',
      'rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh',
    )
    expect(wrapper.find(`[data-testid="issuing-chain-door"] a`)).toExist()
    expectSimpleRowText(wrapper, 'issuing-chain-issue', '\uE900 XRP')

    expectSimpleRowText(wrapper, 'amount', '\uE90010.00 XRP')
    expectSimpleRowText(
      wrapper,
      'destination',
      'rJdTJRJZ6GXCCRaamHJgEqVzB7Zy4557Pi',
    )
    expectSimpleRowText(wrapper, 'claim-id', '5')
  })

  it('renders failed tx', () => {
    const wrapper = createWrapper(mockXChainClaimNoQuorum)

    // check XChainBridge parts
    expectSimpleRowText(
      wrapper,
      'locking-chain-door',
      'rMAXACCrp3Y8PpswXcg3bKggHX76V3F8M4',
    )
    expect(wrapper.find(`[data-testid="locking-chain-door"] a`)).not.toExist()
    expectSimpleRowText(wrapper, 'locking-chain-issue', '\uE900 XRP')
    expectSimpleRowText(
      wrapper,
      'issuing-chain-door',
      'rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh',
    )
    expect(wrapper.find(`[data-testid="issuing-chain-door"] a`)).not.toExist()
    expectSimpleRowText(wrapper, 'issuing-chain-issue', '\uE900 XRP')

    expectSimpleRowText(wrapper, 'amount', '\uE9000.01 XRP')
    expectSimpleRowText(
      wrapper,
      'destination',
      'rpwoKyUQn5uGDKeF6LhxK8HWS25ZMhFpaB',
    )
    expectSimpleRowText(wrapper, 'claim-id', '492')
  })
})
