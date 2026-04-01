import { createSimpleRenderFactory, expectSimpleRowText } from '../../test'
import { Simple } from '../Simple'
import mockXChainClaim from './mock_data/XChainClaim.json'
import mockXChainClaimNoQuorum from './mock_data/XChainClaimNoQuorum.json'

const renderComponent = createSimpleRenderFactory(Simple)

describe('XChainClaimSimple', () => {
  it('renders', () => {
    const { container } = renderComponent(mockXChainClaim)

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

    expectSimpleRowText(container, 'amount', '\uE90010.00 XRP')
    expectSimpleRowText(
      container,
      'destination',
      'rJdTJRJZ6GXCCRaamHJgEqVzB7Zy4557Pi',
    )
    expectSimpleRowText(container, 'claim-id', '5')
  })

  it('renders failed tx', () => {
    const { container } = renderComponent(mockXChainClaimNoQuorum)

    // check XChainBridge parts
    expectSimpleRowText(
      container,
      'locking-chain-door',
      'rMAXACCrp3Y8PpswXcg3bKggHX76V3F8M4',
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

    expectSimpleRowText(container, 'amount', '\uE9000.01 XRP')
    expectSimpleRowText(
      container,
      'destination',
      'rpwoKyUQn5uGDKeF6LhxK8HWS25ZMhFpaB',
    )
    expectSimpleRowText(container, 'claim-id', '492')
  })
})
