import { cleanup, screen } from '@testing-library/react'
import { createSimpleRenderFactory, expectSimpleRowText } from '../../test'
import { Simple } from '../Simple'
import mockXChainCreateClaimID from './mock_data/XChainCreateClaimID.json'
import mockXChainCreateClaimIDFailed from './mock_data/XChainCreateClaimIDFailed.json'

const renderComponent = createSimpleRenderFactory(Simple)

describe('XChainCreateClaimIDSimple', () => {
  afterEach(cleanup)
  it('renders', () => {
    renderComponent(mockXChainCreateClaimID)

    // check XChainBridge parts
    expectSimpleRowText(
      screen,
      'locking-chain-door',
      'rNe5NbD1hqCSZPz9KM5PHm5Bf8jjHfezPE',
    )
    expect(screen.getByTestId('locking-chain-door')).not.toHaveAttribute('href')
    expectSimpleRowText(screen, 'locking-chain-issue', '\uE900 XRP')
    expectSimpleRowText(
      screen,
      'issuing-chain-door',
      'rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh',
    )
    expect(screen.getByTestId('issuing-chain-door')).toHaveAttribute('href')
    expectSimpleRowText(screen, 'issuing-chain-issue', '\uE900 XRP')

    expectSimpleRowText(screen, 'signature-reward', '\uE9000.0001 XRP')
    expectSimpleRowText(
      screen,
      'other-chain-source',
      'raFcdz1g8LWJDJWJE2ZKLRGdmUmsTyxaym',
    )
    expectSimpleRowText(screen, 'claim-id', '1')
  })

  it('renders failed transaction', () => {
    renderComponent(mockXChainCreateClaimIDFailed)

    // check XChainBridge parts
    expectSimpleRowText(
      screen,
      'locking-chain-door',
      'r3rhWeE31Jt5sWmi4QiGLMZnY3ENgqw96W',
    )
    expect(screen.getByTestId('locking-chain-door')).not.toHaveAttribute('href')
    expectSimpleRowText(screen, 'locking-chain-issue', '\uE900 XRP')
    expectSimpleRowText(
      screen,
      'issuing-chain-door',
      'rhub8VRN55s94qWKDv6jmDy1pUykJzF3wq',
    )
    expect(screen.getByTestId('issuing-chain-door')).not.toHaveAttribute('href')
    expectSimpleRowText(screen, 'issuing-chain-issue', '\uE900 XRP')

    expectSimpleRowText(screen, 'signature-reward', '\uE9000.0001 XRP')
    expectSimpleRowText(
      screen,
      'other-chain-source',
      'r3rhWeE31Jt5sWmi4QiGLMZnY3ENgqw96W',
    )
    expect(screen.getByTestId('claim-id')).toBeNull()
  })
})
