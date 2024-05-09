import { Simple } from '../Simple'
import mockXChainCreateBridge from './mock_data/XChainCreateBridge.json'
import mockXChainCreateBridgeFailed from './mock_data/XChainCreateBridgeFailed.json'
import mockXChainCreateBridgeIOU from './mock_data/XChainCreateBridgeIOU.json'
import { createSimpleRenderFactory, expectSimpleRowText } from '../../test'

const createWrapper = createSimpleRenderFactory(Simple)

describe('XChainCreateBridgeSimple', () => {
  it('renders', () => {
    const wrapper = createWrapper(mockXChainCreateBridge)

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

    expectSimpleRowText(wrapper, 'signature-reward', '\uE9000.0001 XRP')
    expect(
      wrapper.find(`[data-testid="min-create-account-amount"]`),
    ).not.toExist()
  })

  it('renders IOU bridge', () => {
    const wrapper = createWrapper(mockXChainCreateBridgeIOU)

    // check XChainBridge parts
    expectSimpleRowText(
      wrapper,
      'locking-chain-door',
      'ratAutb3katzezbXX3LsX4sk4vmvhNucac',
    )
    expect(wrapper.find(`[data-testid="locking-chain-door"] a`)).not.toExist()
    expectSimpleRowText(
      wrapper,
      'locking-chain-issue',
      'USD.rNhm2aTLEnSdcWQ7d6PZ5F7TX5skM7wkAS',
    )
    expectSimpleRowText(
      wrapper,
      'issuing-chain-door',
      'rBkRN2VHVWJVKqfnh1TovLkXo7vLP7oBcq',
    )
    expect(wrapper.find(`[data-testid="issuing-chain-door"] a`)).toExist()
    expectSimpleRowText(
      wrapper,
      'issuing-chain-issue',
      'USD.rBkRN2VHVWJVKqfnh1TovLkXo7vLP7oBcq',
    )

    expectSimpleRowText(wrapper, 'signature-reward', '\uE9000.0001 XRP')
    expectSimpleRowText(wrapper, 'min-account-create-amount', '\uE9005.00 XRP')
  })

  it('renders failed tx', () => {
    const wrapper = createWrapper(mockXChainCreateBridgeFailed)

    // check XChainBridge parts
    expectSimpleRowText(
      wrapper,
      'locking-chain-door',
      'rNFrsx478pH42Vy5w4KN9Hcyh8SDrVmCfd',
    )
    expect(wrapper.find(`[data-testid="locking-chain-door"] a`)).toExist()
    expectSimpleRowText(wrapper, 'locking-chain-issue', '\uE900 XRP')
    expectSimpleRowText(
      wrapper,
      'issuing-chain-door',
      'rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh',
    )
    expect(wrapper.find(`[data-testid="issuing-chain-door"] a`)).not.toExist()
    expectSimpleRowText(wrapper, 'issuing-chain-issue', '\uE900 XRP')

    expectSimpleRowText(wrapper, 'signature-reward', '\uE9000.0001 XRP')
    expectSimpleRowText(wrapper, 'min-account-create-amount', '\uE9005.00 XRP')
  })
})
