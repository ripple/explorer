import { createSimpleWrapperFactory, expectSimpleRowText } from '../../test'
import { Simple } from '../Simple'
import mockXChainCreateClaimID from './mock_data/XChainCreateClaimID.json'

const createWrapper = createSimpleWrapperFactory(Simple)

describe('XChainCreateClaimIDSimple', () => {
  it('renders', () => {
    const wrapper = createWrapper(mockXChainCreateClaimID)

    // check XChainBridge parts
    expectSimpleRowText(
      wrapper,
      'locking-chain-door',
      'rNe5NbD1hqCSZPz9KM5PHm5Bf8jjHfezPE',
    )
    expect(wrapper.find(`[data-test="locking-chain-door"] a`)).not.toExist()
    expectSimpleRowText(wrapper, 'locking-chain-issue', 'XRP')
    expectSimpleRowText(
      wrapper,
      'issuing-chain-door',
      'rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh',
    )
    expect(wrapper.find(`[data-test="issuing-chain-door"] a`)).toExist()
    expectSimpleRowText(wrapper, 'issuing-chain-issue', 'XRP')

    expectSimpleRowText(wrapper, 'signature-reward', '\uE9000.0001 XRP')
    expectSimpleRowText(
      wrapper,
      'other-chain-source',
      'raFcdz1g8LWJDJWJE2ZKLRGdmUmsTyxaym',
    )
    expectSimpleRowText(wrapper, 'claim-id', '5')
  })
})
