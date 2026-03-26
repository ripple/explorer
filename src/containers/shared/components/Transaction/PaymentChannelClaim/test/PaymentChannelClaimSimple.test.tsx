import i18n from '../../../../../../i18n/testConfigEnglish'

import { createSimpleRenderFactory } from '../../test/createWrapperFactory'
import { Simple } from '../Simple'
import mockPaymentChannelClaim from './mock_data/PaymentChannelClaim.json'
import mockPaymentChannelClaimClosed from './mock_data/PaymentChannelClaimClosed.json'
import mockPaymentChannelClaimCloseDenied from './mock_data/PaymentChannelClaimCloseDenied.json'
import mockPaymentChannelClaimWithDestinationTag from './mock_data/PaymentChannelClaimWithDestinationTag.json'
import mockPaymentChannelClaimWithCredentialIDs from './mock_data/PaymentChannelClaimWithCredentialIDs.json'
import {
  expectSimpleRowLabel,
  expectSimpleRowNotToExist,
  expectSimpleRowText,
} from '../../test'

const renderComponent = createSimpleRenderFactory(Simple, i18n)

describe('PaymentChannelClaim: Simple', () => {
  it('renders a claim', () => {
    const { container, unmount } = renderComponent(mockPaymentChannelClaim)
    expectSimpleRowLabel(container, 'amount', 'channel amount')
    expectSimpleRowText(container, 'amount', '\uE90070.00 XRP')
    expectSimpleRowLabel(container, 'claimed', 'amount claimed')
    expectSimpleRowText(container, 'claimed', '\uE9000.01 XRP')
    expectSimpleRowLabel(container, 'total', 'total claimed')
    expectSimpleRowText(container, 'total', '\uE90049.65716 XRP')
    expectSimpleRowLabel(container, 'source', 'source')
    expectSimpleRowText(
      container,
      'source',
      'rnNzy3iPc7gPEAJbAdXwxY1UTBamBqTYhR:1002539517',
    )
    expectSimpleRowLabel(container, 'destination', 'destination')
    expectSimpleRowText(
      container,
      'destination',
      'rK6g2UYc4GpQH8DYdPG7wywyQbxkJpQTTN',
    )
    expectSimpleRowLabel(container, '.channel', 'Channel ID')
    expectSimpleRowText(
      container,
      '.channel',
      '50107651E7163E294CE0EAD8A20BF7CC046304480FCC9C74A49FFAB3F46FB98E',
    )
    expectSimpleRowNotToExist(container, 'renew')
    expectSimpleRowNotToExist(container, 'close-request')
    expectSimpleRowNotToExist(container, 'closed')
    unmount()
  })

  it('renders tx with channel being closed', () => {
    const { container, unmount } = renderComponent(
      mockPaymentChannelClaimClosed,
    )
    expectSimpleRowText(container, 'amount', '\uE90010.00 XRP')
    expectSimpleRowNotToExist(container, 'claimed')
    expectSimpleRowText(container, 'total', '\uE9000.34 XRP')
    expectSimpleRowText(
      container,
      'source',
      'rH11fDGhbVH5NVXNXkGAMTmfWhUHjCtA3B:2647131528',
    )
    expectSimpleRowText(
      container,
      'destination',
      'rK6g2UYc4GpQH8DYdPG7wywyQbxkJpQTTN',
    )
    expectSimpleRowText(
      container,
      '.channel',
      '3BDB4F92432BCEB2385D3BAA60E8AAEC9B552890A240AEE4AA9E88C9E6C517E8',
    )
    expectSimpleRowNotToExist(container, 'renew')
    expectSimpleRowText(container, 'close-request', 'close channel request')
    expectSimpleRowText(container, 'closed', 'payment channel closed')
    unmount()
  })

  it('renders tx requesting channel be closed but not closing it', () => {
    const { container, unmount } = renderComponent(
      mockPaymentChannelClaimCloseDenied,
    )
    expectSimpleRowText(container, 'amount', '\uE90010.00 XRP')
    expectSimpleRowNotToExist(container, 'claimed')
    expectSimpleRowNotToExist(container, 'total')
    expectSimpleRowText(
      container,
      'source',
      'rH11fDGhbVH5NVXNXkGAMTmfWhUHjCtA3B:2647131528',
    )
    expectSimpleRowText(
      container,
      'destination',
      'rK6g2UYc4GpQH8DYdPG7wywyQbxkJpQTTN',
    )
    expectSimpleRowText(
      container,
      '.channel',
      '3BDB4F92432BCEB2385D3BAA60E8AAEC9B552890A240AEE4AA9E88C9E6C517E8',
    )
    expectSimpleRowNotToExist(container, 'renew')
    expectSimpleRowText(container, 'close-request', 'close channel request')
    expectSimpleRowNotToExist(container, 'closed')
    unmount()
  })

  it('renders tx with destination tag', () => {
    const { container, unmount } = renderComponent(
      mockPaymentChannelClaimWithDestinationTag,
    )
    expectSimpleRowText(container, 'amount', '\uE900100.00 XRP')
    expectSimpleRowText(container, 'claimed', '\uE9001.00 XRP')
    expectSimpleRowText(container, 'total', '\uE9001.00 XRP')
    expectSimpleRowText(
      container,
      'source',
      'rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH',
    )
    expectSimpleRowText(
      container,
      'destination',
      'rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn:20170428',
    )
    expectSimpleRowText(
      container,
      '.channel',
      '5DB01B7FFED6B67E6B0414DED11E051D2EE2B7619CE0EAA6286D67A3A4D5BDB3',
    )
    expectSimpleRowNotToExist(container, 'renew')
    expectSimpleRowNotToExist(container, 'close-request')
    expectSimpleRowNotToExist(container, 'closed')
    unmount()
  })

  it('renders tx with CredentialIDs', () => {
    const { container, unmount } = renderComponent(
      mockPaymentChannelClaimWithCredentialIDs,
    )
    expectSimpleRowText(container, 'amount', '\uE90070.00 XRP')
    expectSimpleRowText(container, 'claimed', '\uE9000.01 XRP')
    expectSimpleRowText(container, 'total', '\uE90049.65716 XRP')
    expect(
      container.querySelector('[data-testid="credential-id-0"]'),
    ).toBeInTheDocument()
    expect(
      container.querySelector('[data-testid="credential-id-1"]'),
    ).toBeInTheDocument()
    expect(
      container.querySelector('[data-testid="credential-id-0"] .value'),
    ).toHaveTextContent(
      '7B685088D546B9E8905D26206F452BB2F44D9A33C9BD9BCF280F7BA39015A955',
    )
    expect(
      container.querySelector('[data-testid="credential-id-1"] .value'),
    ).toHaveTextContent(
      '8B685088D546B9E8905D26206F452BB2F44D9A33C9BD9BCF280F7BA39015A956',
    )
    unmount()
  })
})
