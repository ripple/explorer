import { createSimpleRenderFactory, expectSimpleRowText } from '../../test'
import { Simple } from '../Simple'
import mockXChainCreateClaimID from './mock_data/XChainCreateClaimID.json'
import mockXChainCreateClaimIDFailed from './mock_data/XChainCreateClaimIDFailed.json'

const renderComponent = createSimpleRenderFactory(Simple)

describe('XChainCreateClaimIDSimple', () => {
  it('renders', () => {
    const { container, unmount } = renderComponent(mockXChainCreateClaimID)

    // check XChainBridge parts
    expectSimpleRowText(
      container,
      'locking-chain-door',
      'rNe5NbD1hqCSZPz9KM5PHm5Bf8jjHfezPE',
    )
    expect(container.querySelector('[data-testid="locking-chain-door"] a')).not.toBeInTheDocument()
    expectSimpleRowText(container, 'locking-chain-issue', '\uE900 XRP')
    expectSimpleRowText(
      container,
      'issuing-chain-door',
      'rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh',
    )
    expect(container.querySelector('[data-testid="issuing-chain-door"] a')).toBeInTheDocument()
    expectSimpleRowText(container, 'issuing-chain-issue', '\uE900 XRP')

    expectSimpleRowText(container, 'signature-reward', '\uE9000.0001 XRP')
    expectSimpleRowText(
      container,
      'other-chain-source',
      'raFcdz1g8LWJDJWJE2ZKLRGdmUmsTyxaym',
    )
    expectSimpleRowText(container, 'claim-id', '1')
  })

  it('renders failed transaction', () => {
    const { container, unmount } = renderComponent(mockXChainCreateClaimIDFailed)

    // check XChainBridge parts
    expectSimpleRowText(
      container,
      'locking-chain-door',
      'r3rhWeE31Jt5sWmi4QiGLMZnY3ENgqw96W',
    )
    expect(container.querySelector('[data-testid="locking-chain-door"] a')).not.toBeInTheDocument()
    expectSimpleRowText(container, 'locking-chain-issue', '\uE900 XRP')
    expectSimpleRowText(
      container,
      'issuing-chain-door',
      'rhub8VRN55s94qWKDv6jmDy1pUykJzF3wq',
    )
    expect(container.querySelector('[data-testid="issuing-chain-door"] a')).not.toBeInTheDocument()
    expectSimpleRowText(container, 'issuing-chain-issue', '\uE900 XRP')

    expectSimpleRowText(container, 'signature-reward', '\uE9000.0001 XRP')
    expectSimpleRowText(
      container,
      'other-chain-source',
      'r3rhWeE31Jt5sWmi4QiGLMZnY3ENgqw96W',
    )
    expect(container.querySelector('[data-testid="claim-id"]')).not.toBeInTheDocument()
  })
})
