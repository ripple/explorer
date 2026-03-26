import { createSimpleRenderFactory } from '../../test/createWrapperFactory'
import { Simple } from '../Simple'
import mockXChainAddAccountCreateAttestation from './mock_data/XChainAddAccountCreateAttestation.json'
import mockXChainAddAccountCreateAttestationFailed from './mock_data/XChainAddAccountCreateAttestationFailed.json'
import { expectSimpleRowText } from '../../test/expectations'

const renderComponent = createSimpleRenderFactory(Simple)

describe('XChainAddAccountCreateAttestationSimple', () => {
  it('renders', () => {
    const { container } = renderComponent(mockXChainAddAccountCreateAttestation)

    // check XChainBridge parts
    expectSimpleRowText(
      container,
      'locking-chain-door',
      'rDPwN6dz3shffxodeUC9Qf5y1mEHYySKLJ',
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
    ).not.toBeInTheDocument()
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
      'rLbKhMNskUBYRShdbbQcFm9YhumEeUJfPK',
    )
    expect(
      container.querySelector('[data-testid="destination"] a'),
    ).toBeInTheDocument()
  })

  it('renders failed transaction', () => {
    const { container } = renderComponent(
      mockXChainAddAccountCreateAttestationFailed,
    )

    // check XChainBridge parts
    expectSimpleRowText(
      container,
      'locking-chain-door',
      'rNFrsx478pH42Vy5w4KN9Hcyh8SDrVmCfd',
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
    ).not.toBeInTheDocument()
    expectSimpleRowText(container, 'issuing-chain-issue', '\uE900 XRP')

    expectSimpleRowText(container, 'send', '\uE90010.00 XRP')
    expectSimpleRowText(
      container,
      'other_chain_source',
      'rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh',
    )
    expectSimpleRowText(
      container,
      'destination',
      'rPy1F9bQ7dNn2T3QAFRM6dFz6ygHa3MDDi',
    )
    expect(
      container.querySelector('[data-testid="destination"] a'),
    ).toBeInTheDocument()
  })
})
