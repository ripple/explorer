import { createSimpleRenderFactory } from '../../test/createWrapperFactory'
import { Simple } from '../Simple'
import mockXChainAddClaimAttestation from './mock_data/XChainAddClaimAttestation.json'
import mockXChainAddClaimAttestationFailed from './mock_data/XChainAddClaimAttestationFailed.json'
import { expectSimpleRowText } from '../../test/expectations'

const renderComponent = createSimpleRenderFactory(Simple)

describe('XChainAddClaimAttestationSimple', () => {
  it('renders', () => {
    const { container, unmount } = renderComponent(mockXChainAddClaimAttestation)

    // check XChainBridge parts
    expectSimpleRowText(
      container,
      'locking-chain-door',
      'r3ZsJYkBao2qiwUCvmjfgEUquKueLAwPxQ',
    )
    expect(container.querySelector('[data-testid="locking-chain-door"] a')).not.toBeInTheDocument()
    expectSimpleRowText(container, 'locking-chain-issue', '\uE900 XRP')
    expectSimpleRowText(
      container,
      'issuing-chain-door',
      'rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh',
    )
    expect(container.querySelector('[data-testid="issuing-chain-door"] a')).not.toBeInTheDocument()
    expectSimpleRowText(container, 'issuing-chain-issue', '\uE900 XRP')

    expectSimpleRowText(container, 'send', '\uE90010.00 XRP')
    expectSimpleRowText(
      container,
      'other_chain_source',
      'raFcdz1g8LWJDJWJE2ZKLRGdmUmsTyxaym',
    )
    expectSimpleRowText(
      container,
      'destination',
      'rJdTJRJZ6GXCCRaamHJgEqVzB7Zy4557Pi',
    )
    expect(container.querySelector('[data-testid="destination"] a')).toBeInTheDocument()
    expectSimpleRowText(container, 'xchain-claim-id', '1')
  })

  it('renders failed transaction', () => {
    const { container, unmount } = renderComponent(mockXChainAddClaimAttestationFailed)

    // check XChainBridge parts
    expectSimpleRowText(
      container,
      'locking-chain-door',
      'rNFrsx478pH42Vy5w4KN9Hcyh8SDrVmCfd',
    )
    expect(container.querySelector('[data-testid="locking-chain-door"] a')).not.toBeInTheDocument()
    expectSimpleRowText(container, 'locking-chain-issue', '\uE900 XRP')
    expectSimpleRowText(
      container,
      'issuing-chain-door',
      'rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh',
    )
    expect(container.querySelector('[data-testid="issuing-chain-door"] a')).not.toBeInTheDocument()
    expectSimpleRowText(container, 'issuing-chain-issue', '\uE900 XRP')

    expectSimpleRowText(container, 'send', '\uE90010.00 XRP')
    expectSimpleRowText(
      container,
      'other_chain_source',
      'raFcdz1g8LWJDJWJE2ZKLRGdmUmsTyxaym',
    )
    expectSimpleRowText(
      container,
      'destination',
      'rJdTJRJZ6GXCCRaamHJgEqVzB7Zy4557Pi',
    )
    expect(container.querySelector('[data-testid="destination"] a')).toBeInTheDocument()
    expectSimpleRowText(container, 'xchain-claim-id', '3')
  })
})
