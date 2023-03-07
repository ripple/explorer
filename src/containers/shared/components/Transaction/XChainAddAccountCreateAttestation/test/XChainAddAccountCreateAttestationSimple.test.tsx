import { createSimpleWrapperFactory } from '../../test/createWrapperFactory'
import { Simple } from '../Simple'
import mockXChainAddAccountCreateAttestation from './mock_data/XChainAddAccountCreateAttestation.json'
import { expectSimpleRowText } from '../../test/expectations'

const createWrapper = createSimpleWrapperFactory(Simple)

describe('XChainAddAccountCreateAttestationSimple', () => {
  it('renders', () => {
    const wrapper = createWrapper(mockXChainAddAccountCreateAttestation)

    // check XChainBridge parts
    expectSimpleRowText(
      wrapper,
      'locking-chain-door',
      'rDPwN6dz3shffxodeUC9Qf5y1mEHYySKLJ',
    )
    expect(wrapper.find(`[data-test="locking-chain-door"] a`)).not.toExist()
    expectSimpleRowText(wrapper, 'locking-chain-issue', 'XRP')
    expectSimpleRowText(
      wrapper,
      'issuing-chain-door',
      'rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh',
    )
    expect(wrapper.find(`[data-test="issuing-chain-door"] a`)).not.toExist()
    expectSimpleRowText(wrapper, 'issuing-chain-issue', 'XRP')

    expectSimpleRowText(wrapper, 'send', '\uE90010.00 XRP')
    expectSimpleRowText(
      wrapper,
      'other_chain_source',
      'raFcdz1g8LWJDJWJE2ZKLRGdmUmsTyxaym',
    )
    expectSimpleRowText(
      wrapper,
      'destination',
      'rLbKhMNskUBYRShdbbQcFm9YhumEeUJfPK',
    )
    expect(wrapper.find(`[data-test="destination"] a`)).toExist()
  })
})
