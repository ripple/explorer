import { createSimpleRenderFactory, expectSimpleRowText } from '../../test'
import { Simple } from '../Simple'
import mockXChainModifyBridge from './mock_data/XChainModifyBridge.json'
import mockXChainModifyBridgeMinAccountCreateAmount from './mock_data/XChainModifyBridgeMinAccountCreateAmount.json'
import mockXChainModifyBridgeNoEntry from './mock_data/XChainModifyBridgeNoEntry.json'

const renderComponent = createSimpleRenderFactory(Simple)

describe('XChainModifyBridgeSimple', () => {
  it('renders', () => {
    const { container } = renderComponent(mockXChainModifyBridge)

    // check XChainBridge parts
    expectSimpleRowText(
      container,
      'locking-chain-door',
      'rGQLcxzT3Po9PsCk5Lj9uK7S1juThii9cR',
    )
    expect(
      container.querySelector('[data-testid="locking-chain-door"] a'),
    ).not.toBeInTheDocument()
    expectSimpleRowText(container, 'locking-chain-issue', '\uE900 XRP')
    expectSimpleRowText(
      container,
      'issuing-chain-door',
      'rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh',
    )
    expect(
      container.querySelector('[data-testid="issuing-chain-door"] a'),
    ).toBeInTheDocument()
    expectSimpleRowText(container, 'issuing-chain-issue', '\uE900 XRP')

    expectSimpleRowText(container, 'signature-reward', '\uE9000.01 XRP')
  })

  it('renders MinAccountCreateAmount', () => {
    const { container } = renderComponent(
      mockXChainModifyBridgeMinAccountCreateAmount,
    )

    // check XChainBridge parts
    expectSimpleRowText(
      container,
      'locking-chain-door',
      'rnBnyot2gCJywLxLzfHQX2dUJqZ6oghUFp',
    )
    expect(
      container.querySelector('[data-testid="locking-chain-door"] a'),
    ).toBeInTheDocument()
    expectSimpleRowText(container, 'locking-chain-issue', '\uE900 XRP')
    expectSimpleRowText(
      container,
      'issuing-chain-door',
      'rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh',
    )
    expect(
      container.querySelector('[data-testid="issuing-chain-door"] a'),
    ).not.toBeInTheDocument()
    expectSimpleRowText(container, 'issuing-chain-issue', '\uE900 XRP')

    expectSimpleRowText(
      container,
      'min-account-create-amount',
      '\uE900100.00 XRP',
    )
  })

  it('renders failed transaction', () => {
    const { container } = renderComponent(mockXChainModifyBridgeNoEntry)

    // check XChainBridge parts
    expectSimpleRowText(
      container,
      'locking-chain-door',
      'r3rhWeE31Jt5sWmi4QiGLMZnY3ENgqw96W',
    )
    expect(
      container.querySelector('[data-testid="locking-chain-door"] a'),
    ).not.toBeInTheDocument()
    expectSimpleRowText(container, 'locking-chain-issue', '\uE900 XRP')
    expectSimpleRowText(
      container,
      'issuing-chain-door',
      'rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh',
    )
    expect(
      container.querySelector('[data-testid="issuing-chain-door"] a'),
    ).toBeInTheDocument()
    expectSimpleRowText(container, 'issuing-chain-issue', '\uE900 XRP')

    expectSimpleRowText(container, 'signature-reward', '\uE9000.0001 XRP')
  })
})
