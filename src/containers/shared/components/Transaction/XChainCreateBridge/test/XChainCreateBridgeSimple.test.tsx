import { Simple } from '../Simple'
import mockXChainCreateBridge from './mock_data/XChainCreateBridge.json'
import mockXChainCreateBridgeFailed from './mock_data/XChainCreateBridgeFailed.json'
import mockXChainCreateBridgeIOU from './mock_data/XChainCreateBridgeIOU.json'
import { createSimpleRenderFactory, expectSimpleRowText } from '../../test'

const renderComponent = createSimpleRenderFactory(Simple)

describe('XChainCreateBridgeSimple', () => {
  it('renders', () => {
    const { container, unmount } = renderComponent(mockXChainCreateBridge)

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

    expectSimpleRowText(container, 'signature-reward', '\uE9000.0001 XRP')
    expect(
      container.querySelector('[data-testid="min-create-account-amount"]'),
    ).not.toBeInTheDocument()
    unmount()
  })

  it('renders IOU bridge', () => {
    const { container } = renderComponent(mockXChainCreateBridgeIOU)

    // check XChainBridge parts
    expectSimpleRowText(
      container,
      'locking-chain-door',
      'ratAutb3katzezbXX3LsX4sk4vmvhNucac',
    )
    expect(
      container.querySelector('[data-testid="locking-chain-door"] a'),
    ).not.toBeInTheDocument()
    expectSimpleRowText(
      container,
      'locking-chain-issue',
      'USD.rNhm2aTLEnSdcWQ7d6PZ5F7TX5skM7wkAS',
    )
    expectSimpleRowText(
      container,
      'issuing-chain-door',
      'rBkRN2VHVWJVKqfnh1TovLkXo7vLP7oBcq',
    )
    expect(
      container.querySelector('[data-testid="issuing-chain-door"] a'),
    ).toBeInTheDocument()
    expectSimpleRowText(
      container,
      'issuing-chain-issue',
      'USD.rBkRN2VHVWJVKqfnh1TovLkXo7vLP7oBcq',
    )

    expectSimpleRowText(container, 'signature-reward', '\uE9000.0001 XRP')
    expectSimpleRowText(
      container,
      'min-account-create-amount',
      '\uE9005.00 XRP',
    )
  })

  it('renders failed tx', () => {
    const { container } = renderComponent(mockXChainCreateBridgeFailed)

    // check XChainBridge parts
    expectSimpleRowText(
      container,
      'locking-chain-door',
      'rNFrsx478pH42Vy5w4KN9Hcyh8SDrVmCfd',
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

    expectSimpleRowText(container, 'signature-reward', '\uE9000.0001 XRP')
    expectSimpleRowText(
      container,
      'min-account-create-amount',
      '\uE9005.00 XRP',
    )
  })
})
