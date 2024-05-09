import { createSimpleRenderFactory } from '../../test/createRenderFactory'
import { cleanup, screen } from '@testing-library/react'
import { Simple } from '../Simple'
import mockXChainAddAccountCreateAttestation from './mock_data/XChainAddAccountCreateAttestation.json'
import mockXChainAddAccountCreateAttestationFailed from './mock_data/XChainAddAccountCreateAttestationFailed.json'
import { expectSimpleRowText } from '../../test/expectations'

const renderComponent = createSimpleRenderFactory(Simple)

describe('XChainAddAccountCreateAttestationSimple', () => {
  it('renders', () => {
    renderComponent(mockXChainAddAccountCreateAttestation)

    // check XChainBridge parts
    expectSimpleRowText(
      screen,
      'locking-chain-door',
      'rDPwN6dz3shffxodeUC9Qf5y1mEHYySKLJ',
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

    expectSimpleRowText(screen, 'send', '\uE90010.00 XRP')
    expectSimpleRowText(
      screen,
      'other_chain_source',
      'raFcdz1g8LWJDJWJE2ZKLRGdmUmsTyxaym',
    )
    expectSimpleRowText(
      screen,
      'destination',
      'rLbKhMNskUBYRShdbbQcFm9YhumEeUJfPK',
    )
    expect(screen.find(`[data-testid="destination"] a`)).toExist()
  })

  it('renders failed transaction', () => {
    renderComponent(mockXChainAddAccountCreateAttestationFailed)

    // check XChainBridge parts
    expectSimpleRowText(
      screen,
      'locking-chain-door',
      'rNFrsx478pH42Vy5w4KN9Hcyh8SDrVmCfd',
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

    expectSimpleRowText(screen, 'send', '\uE90010.00 XRP')
    expectSimpleRowText(
      screen,
      'other_chain_source',
      'rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh',
    )
    expectSimpleRowText(
      screen,
      'destination',
      'rPy1F9bQ7dNn2T3QAFRM6dFz6ygHa3MDDi',
    )
    expect(screen.find(`[data-testid="destination"] a`)).toExist()
  })
})
