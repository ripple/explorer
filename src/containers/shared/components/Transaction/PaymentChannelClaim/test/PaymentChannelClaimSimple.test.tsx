import { cleanup, screen } from '@testing-library/react'
import i18n from '../../../../../../i18n/testConfigEnglish'

import { createSimpleRenderFactory } from '../../test/createRenderFactory'
import { Simple } from '../Simple'
import mockPaymentChannelClaim from './mock_data/PaymentChannelClaim.json'
import mockPaymentChannelClaimClosed from './mock_data/PaymentChannelClaimClosed.json'
import mockPaymentChannelClaimCloseDenied from './mock_data/PaymentChannelClaimCloseDenied.json'
import mockPaymentChannelClaimWithDestinationTag from './mock_data/PaymentChannelClaimWithDestinationTag.json'
import {
  expectSimpleRowLabel,
  expectSimpleRowNotToExist,
  expectSimpleRowText,
} from '../../test'

const renderComponent = createSimpleRenderFactory(Simple, i18n)

describe('PaymentChannelClaim: Simple', () => {
  afterEach(cleanup)
  it('renders a claim', () => {
    renderComponent(mockPaymentChannelClaim)
    expectSimpleRowLabel(screen, 'channel-amount', 'channel amount')
    expectSimpleRowText(screen, 'channel-amount', '\uE90070.00 XRP')
    expectSimpleRowLabel(screen, 'claimed', 'amount claimed')
    expectSimpleRowText(screen, 'claimed', '\uE9000.01 XRP')
    expectSimpleRowLabel(screen, 'total', 'total claimed')
    expectSimpleRowText(screen, 'total', '\uE90049.65716 XRP')
    expectSimpleRowLabel(screen, 'source', 'source')
    expectSimpleRowText(
      screen,
      'source',
      'rnNzy3iPc7gPEAJbAdXwxY1UTBamBqTYhR:1002539517',
    )
    expectSimpleRowLabel(screen, 'destination', 'destination')
    expectSimpleRowText(
      screen,
      'destination',
      'rK6g2UYc4GpQH8DYdPG7wywyQbxkJpQTTN',
    )
    expectSimpleRowLabel(screen, 'channel', 'Channel ID')
    expectSimpleRowText(
      screen,
      'channel',
      '50107651E7163E294CE0EAD8A20BF7CC046304480FCC9C74A49FFAB3F46FB98E',
    )
    expectSimpleRowNotToExist(screen, 'renew')
    expectSimpleRowNotToExist(screen, 'close-request')
    expectSimpleRowNotToExist(screen, 'closed')
  })

  it('renders tx with channel being closed', () => {
    renderComponent(mockPaymentChannelClaimClosed)
    expectSimpleRowText(screen, 'channel-amount', '\uE90010.00 XRP')
    expectSimpleRowNotToExist(screen, 'claimed')
    expectSimpleRowText(screen, 'total', '\uE9000.34 XRP')
    expectSimpleRowText(
      screen,
      'source',
      'rH11fDGhbVH5NVXNXkGAMTmfWhUHjCtA3B:2647131528',
    )
    expectSimpleRowText(
      screen,
      'destination',
      'rK6g2UYc4GpQH8DYdPG7wywyQbxkJpQTTN',
    )
    expectSimpleRowText(
      screen,
      'channel',
      '3BDB4F92432BCEB2385D3BAA60E8AAEC9B552890A240AEE4AA9E88C9E6C517E8',
    )
    expectSimpleRowNotToExist(screen, 'renew')
    expectSimpleRowText(screen, 'close-request', 'close channel request')
    expectSimpleRowText(screen, 'closed', 'payment channel closed')
  })

  it('renders tx requesting channel be closed but not closing it', () => {
    renderComponent(mockPaymentChannelClaimCloseDenied)
    expectSimpleRowText(screen, 'channel-amount', '\uE90010.00 XRP')
    expectSimpleRowNotToExist(screen, 'claimed')
    expectSimpleRowNotToExist(screen, 'total')
    expectSimpleRowText(
      screen,
      'source',
      'rH11fDGhbVH5NVXNXkGAMTmfWhUHjCtA3B:2647131528',
    )
    expectSimpleRowText(
      screen,
      'destination',
      'rK6g2UYc4GpQH8DYdPG7wywyQbxkJpQTTN',
    )
    expectSimpleRowText(
      screen,
      'channel',
      '3BDB4F92432BCEB2385D3BAA60E8AAEC9B552890A240AEE4AA9E88C9E6C517E8',
    )
    expectSimpleRowNotToExist(screen, 'renew')
    expectSimpleRowText(screen, 'close-request', 'close channel request')
    expectSimpleRowNotToExist(screen, 'closed')
  })

  it('renders tx with destination tag', () => {
    renderComponent(mockPaymentChannelClaimWithDestinationTag)
    expectSimpleRowText(screen, 'channel-amount', '\uE900100.00 XRP')
    expectSimpleRowText(screen, 'claimed', '\uE9001.00 XRP')
    expectSimpleRowText(screen, 'total', '\uE9001.00 XRP')
    expectSimpleRowText(screen, 'source', 'rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH')
    expectSimpleRowText(
      screen,
      'destination',
      'rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn:20170428',
    )
    expectSimpleRowText(
      screen,
      'channel',
      '5DB01B7FFED6B67E6B0414DED11E051D2EE2B7619CE0EAA6286D67A3A4D5BDB3',
    )
    expectSimpleRowNotToExist(screen, 'renew')
    expectSimpleRowNotToExist(screen, 'close-request')
    expectSimpleRowNotToExist(screen, 'closed')
  })
})
