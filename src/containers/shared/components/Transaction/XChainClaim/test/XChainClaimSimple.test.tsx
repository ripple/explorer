import { cleanup, screen } from '@testing-library/react'
import { createSimpleRenderFactory, expectSimpleRowText } from '../../test'
import { Simple } from '../Simple'
import mockXChainClaim from './mock_data/XChainClaim.json'
import mockXChainClaimNoQuorum from './mock_data/XChainClaimNoQuorum.json'

const renderComponent = createSimpleRenderFactory(Simple)

describe('XChainClaimSimple', () => {
  it('renders', () => {
    renderComponent(mockXChainClaim)

    // check XChainBridge parts
    expectSimpleRowText(
      screen,
      'locking-chain-door',
      'rGQLcxzT3Po9PsCk5Lj9uK7S1juThii9cR',
    )
    expect(screen.find(`[data-testid="locking-chain-door"] a`)).not.toExist()
    expectSimpleRowText(screen, 'locking-chain-issue', '\uE900 XRP')
    expectSimpleRowText(
      screen,
      'issuing-chain-door',
      'rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh',
    )
    expect(screen.find(`[data-testid="issuing-chain-door"] a`)).toExist()
    expectSimpleRowText(screen, 'issuing-chain-issue', '\uE900 XRP')

    expectSimpleRowText(screen, 'amount', '\uE90010.00 XRP')
    expectSimpleRowText(
      screen,
      'destination',
      'rJdTJRJZ6GXCCRaamHJgEqVzB7Zy4557Pi',
    )
    expectSimpleRowText(screen, 'claim-id', '5')
  })

  it('renders failed tx', () => {
    renderComponent(mockXChainClaimNoQuorum)

    // check XChainBridge parts
    expectSimpleRowText(
      screen,
      'locking-chain-door',
      'rMAXACCrp3Y8PpswXcg3bKggHX76V3F8M4',
    )
    expect(screen.find(`[data-testid="locking-chain-door"] a`)).not.toExist()
    expectSimpleRowText(screen, 'locking-chain-issue', '\uE900 XRP')
    expectSimpleRowText(
      screen,
      'issuing-chain-door',
      'rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh',
    )
    expect(screen.find(`[data-testid="issuing-chain-door"] a`)).not.toExist()
    expectSimpleRowText(screen, 'issuing-chain-issue', '\uE900 XRP')

    expectSimpleRowText(screen, 'amount', '\uE9000.01 XRP')
    expectSimpleRowText(
      screen,
      'destination',
      'rpwoKyUQn5uGDKeF6LhxK8HWS25ZMhFpaB',
    )
    expectSimpleRowText(screen, 'claim-id', '492')
  })
})
