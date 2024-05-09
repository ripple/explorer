import { cleanup, screen } from '@testing-library/react'
import { createSimpleRenderFactory } from '../../test/createRenderFactory'
import { Simple } from '../Simple'
import mockXChainAddClaimAttestation from './mock_data/XChainAddClaimAttestation.json'
import mockXChainAddClaimAttestationFailed from './mock_data/XChainAddClaimAttestationFailed.json'
import { expectSimpleRowText } from '../../test/expectations'

const renderComponent = createSimpleRenderFactory(Simple)

describe('XChainAddClaimAttestationSimple', () => {
  afterEach(cleanup)
  it('renders', () => {
    renderComponent(mockXChainAddClaimAttestation)

    // check XChainBridge parts
    expectSimpleRowText(
      screen,
      'locking-chain-door',
      'r3ZsJYkBao2qiwUCvmjfgEUquKueLAwPxQ',
    )
    expect(screen.getByTestId('locking-chain-door')).not.toHaveAttribute('href')
    expectSimpleRowText(screen, 'locking-chain-issue', '\uE900 XRP')
    expectSimpleRowText(
      screen,
      'issuing-chain-door',
      'rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh',
    )
    expect(screen.getByTestId('issuing-chain-door')).not.toHaveAttribute('href')
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
      'rJdTJRJZ6GXCCRaamHJgEqVzB7Zy4557Pi',
    )
    expect(screen.getByTestId('destination')).toHaveAttribute('href')
    expectSimpleRowText(screen, 'xchain-claim-id', '1')
  })

  it('renders failed transaction', () => {
    renderComponent(mockXChainAddClaimAttestationFailed)

    // check XChainBridge parts
    expectSimpleRowText(
      screen,
      'locking-chain-door',
      'rNFrsx478pH42Vy5w4KN9Hcyh8SDrVmCfd',
    )
    expect(screen.getByTestId('locking-chain-door')).not.toHaveAttribute('href')
    expectSimpleRowText(screen, 'locking-chain-issue', '\uE900 XRP')
    expectSimpleRowText(
      screen,
      'issuing-chain-door',
      'rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh',
    )
    expect(screen.getByTestId('issuing-chain-door')).not.toHaveAttribute('href')
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
      'rJdTJRJZ6GXCCRaamHJgEqVzB7Zy4557Pi',
    )
    expect(screen.getByTestId('destination')).toHaveAttribute('href')
    expectSimpleRowText(screen, 'xchain-claim-id', '3')
  })
})
