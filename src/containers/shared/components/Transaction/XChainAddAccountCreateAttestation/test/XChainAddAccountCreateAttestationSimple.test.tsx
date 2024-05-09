import { createSimpleWrapperFactory } from '../../test/createWrapperFactory'
import { Simple } from '../Simple'
import mockXChainAddAccountCreateAttestation from './mock_data/XChainAddAccountCreateAttestation.json'
import mockXChainAddAccountCreateAttestationFailed from './mock_data/XChainAddAccountCreateAttestationFailed.json'
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
    expect(wrapper.find(`[data-testid="locking-chain-door"] a`)).not.toExist()
    expectSimpleRowText(wrapper, 'locking-chain-issue', '\uE900 XRP')
    expectSimpleRowText(
      wrapper,
      'issuing-chain-door',
      'rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh',
    )
    expect(wrapper.find(`[data-testid="issuing-chain-door"] a`)).not.toExist()
    expectSimpleRowText(wrapper, 'issuing-chain-issue', '\uE900 XRP')

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
    expect(wrapper.find(`[data-testid="destination"] a`)).toExist()
  })

  it('renders failed transaction', () => {
    const wrapper = createWrapper(mockXChainAddAccountCreateAttestationFailed)

    // check XChainBridge parts
    expectSimpleRowText(
      wrapper,
      'locking-chain-door',
      'rNFrsx478pH42Vy5w4KN9Hcyh8SDrVmCfd',
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

    expectSimpleRowText(wrapper, 'send', '\uE90010.00 XRP')
    expectSimpleRowText(
      wrapper,
      'other_chain_source',
      'rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh',
    )
    expectSimpleRowText(
      wrapper,
      'destination',
      'rPy1F9bQ7dNn2T3QAFRM6dFz6ygHa3MDDi',
    )
    expect(wrapper.find(`[data-testid="destination"] a`)).toExist()
  })
})
