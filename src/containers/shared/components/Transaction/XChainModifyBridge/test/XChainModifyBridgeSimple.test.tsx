import { createSimpleWrapperFactory, expectSimpleRowText } from '../../test'
import { Simple } from '../Simple'
import mockXChainModifyBridge from './mock_data/XChainModifyBridge.json'
import mockXChainModifyBridgeMinAccountCreateAmount from './mock_data/XChainModifyBridgeMinAccountCreateAmount.json'
import mockXChainModifyBridgeNoEntry from './mock_data/XChainModifyBridgeNoEntry.json'

const createWrapper = createSimpleWrapperFactory(Simple)

describe('XChainModifyBridgeSimple', () => {
  it('renders', () => {
    const wrapper = createWrapper(mockXChainModifyBridge)

    // check XChainBridge parts
    expectSimpleRowText(
      wrapper,
      'locking-chain-door',
      'rGQLcxzT3Po9PsCk5Lj9uK7S1juThii9cR',
    )
    expect(wrapper.find(`[data-test="locking-chain-door"] a`)).not.toExist()
    expectSimpleRowText(wrapper, 'locking-chain-issue', '\uE900 XRP')
    expectSimpleRowText(
      wrapper,
      'issuing-chain-door',
      'rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh',
    )
    expect(wrapper.find(`[data-test="issuing-chain-door"] a`)).toExist()
    expectSimpleRowText(wrapper, 'issuing-chain-issue', '\uE900 XRP')

    expectSimpleRowText(wrapper, 'signature-reward', '\uE9000.01 XRP')
  })

  it('renders MinAccountCreateAmount', () => {
    const wrapper = createWrapper(mockXChainModifyBridgeMinAccountCreateAmount)

    // check XChainBridge parts
    expectSimpleRowText(
      wrapper,
      'locking-chain-door',
      'rnBnyot2gCJywLxLzfHQX2dUJqZ6oghUFp',
    )
    expect(wrapper.find(`[data-test="locking-chain-door"] a`)).toExist()
    expectSimpleRowText(wrapper, 'locking-chain-issue', '\uE900 XRP')
    expectSimpleRowText(
      wrapper,
      'issuing-chain-door',
      'rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh',
    )
    expect(wrapper.find(`[data-test="issuing-chain-door"] a`)).not.toExist()
    expectSimpleRowText(wrapper, 'issuing-chain-issue', '\uE900 XRP')

    expectSimpleRowText(
      wrapper,
      'min-account-create-amount',
      '\uE900100.00 XRP',
    )
  })

  it('renders failed transaction', () => {
    const wrapper = createWrapper(mockXChainModifyBridgeNoEntry)

    // check XChainBridge parts
    expectSimpleRowText(
      wrapper,
      'locking-chain-door',
      'r3rhWeE31Jt5sWmi4QiGLMZnY3ENgqw96W',
    )
    expect(wrapper.find(`[data-test="locking-chain-door"] a`)).not.toExist()
    expectSimpleRowText(wrapper, 'locking-chain-issue', '\uE900 XRP')
    expectSimpleRowText(
      wrapper,
      'issuing-chain-door',
      'rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh',
    )
    expect(wrapper.find(`[data-test="issuing-chain-door"] a`)).toExist()
    expectSimpleRowText(wrapper, 'issuing-chain-issue', '\uE900 XRP')

    expectSimpleRowText(wrapper, 'signature-reward', '\uE9000.0001 XRP')
  })
})
