import i18n from '../../../../../../i18n/testConfigEnglish'

import { createSimpleWrapperFactory } from '../../test/createWrapperFactory'
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

const createWrapper = createSimpleWrapperFactory(Simple, i18n)

describe('PaymentChannelClaim: Simple', () => {
  it('renders a claim', () => {
    const wrapper = createWrapper(mockPaymentChannelClaim)
    expectSimpleRowLabel(wrapper, 'amount', 'channel amount')
    expectSimpleRowText(wrapper, 'amount', '\uE90070.00 XRP')
    expectSimpleRowLabel(wrapper, 'claimed', 'amount claimed')
    expectSimpleRowText(wrapper, 'claimed', '\uE9000.01 XRP')
    expectSimpleRowLabel(wrapper, 'total', 'total claimed')
    expectSimpleRowText(wrapper, 'total', '\uE90049.65716 XRP')
    expectSimpleRowLabel(wrapper, 'source', 'source')
    expectSimpleRowText(
      wrapper,
      'source',
      'rnNzy3iPc7gPEAJbAdXwxY1UTBamBqTYhR:1002539517',
    )
    expectSimpleRowLabel(wrapper, 'destination', 'destination')
    expectSimpleRowText(
      wrapper,
      'destination',
      'rK6g2UYc4GpQH8DYdPG7wywyQbxkJpQTTN',
    )
    expectSimpleRowLabel(wrapper, '.channel', 'Channel ID')
    expectSimpleRowText(
      wrapper,
      '.channel',
      '50107651E7163E294CE0EAD8A20BF7CC046304480FCC9C74A49FFAB3F46FB98E',
    )
    expectSimpleRowNotToExist(wrapper, 'renew')
    expectSimpleRowNotToExist(wrapper, 'close-request')
    expectSimpleRowNotToExist(wrapper, 'closed')
    wrapper.unmount()
  })

  it('renders tx with channel being closed', () => {
    const wrapper = createWrapper(mockPaymentChannelClaimClosed)
    expectSimpleRowText(wrapper, 'amount', '\uE90010.00 XRP')
    expectSimpleRowNotToExist(wrapper, 'claimed')
    expectSimpleRowText(wrapper, 'total', '\uE9000.34 XRP')
    expectSimpleRowText(
      wrapper,
      'source',
      'rH11fDGhbVH5NVXNXkGAMTmfWhUHjCtA3B:2647131528',
    )
    expectSimpleRowText(
      wrapper,
      'destination',
      'rK6g2UYc4GpQH8DYdPG7wywyQbxkJpQTTN',
    )
    expectSimpleRowText(
      wrapper,
      '.channel',
      '3BDB4F92432BCEB2385D3BAA60E8AAEC9B552890A240AEE4AA9E88C9E6C517E8',
    )
    expectSimpleRowNotToExist(wrapper, 'renew')
    expectSimpleRowText(wrapper, 'close-request', 'close channel request')
    expectSimpleRowText(wrapper, 'closed', 'payment channel closed')
    wrapper.unmount()
  })

  it('renders tx requesting channel be closed but not closing it', () => {
    const wrapper = createWrapper(mockPaymentChannelClaimCloseDenied)
    expectSimpleRowText(wrapper, 'amount', '\uE90010.00 XRP')
    expectSimpleRowNotToExist(wrapper, 'claimed')
    expectSimpleRowNotToExist(wrapper, 'total')
    expectSimpleRowText(
      wrapper,
      'source',
      'rH11fDGhbVH5NVXNXkGAMTmfWhUHjCtA3B:2647131528',
    )
    expectSimpleRowText(
      wrapper,
      'destination',
      'rK6g2UYc4GpQH8DYdPG7wywyQbxkJpQTTN',
    )
    expectSimpleRowText(
      wrapper,
      '.channel',
      '3BDB4F92432BCEB2385D3BAA60E8AAEC9B552890A240AEE4AA9E88C9E6C517E8',
    )
    expectSimpleRowNotToExist(wrapper, 'renew')
    expectSimpleRowText(wrapper, 'close-request', 'close channel request')
    expectSimpleRowNotToExist(wrapper, 'closed')
    wrapper.unmount()
  })

  it('renders tx with destination tag', () => {
    const wrapper = createWrapper(mockPaymentChannelClaimWithDestinationTag)
    expectSimpleRowText(wrapper, 'amount', '\uE900100.00 XRP')
    expectSimpleRowText(wrapper, 'claimed', '\uE9001.00 XRP')
    expectSimpleRowText(wrapper, 'total', '\uE9001.00 XRP')
    expectSimpleRowText(wrapper, 'source', 'rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH')
    expectSimpleRowText(
      wrapper,
      'destination',
      'rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn:20170428',
    )
    expectSimpleRowText(
      wrapper,
      '.channel',
      '5DB01B7FFED6B67E6B0414DED11E051D2EE2B7619CE0EAA6286D67A3A4D5BDB3',
    )
    expectSimpleRowNotToExist(wrapper, 'renew')
    expectSimpleRowNotToExist(wrapper, 'close-request')
    expectSimpleRowNotToExist(wrapper, 'closed')
    wrapper.unmount()
  })

  it('renders tx with CredentialIDs', () => {
    const wrapper = createWrapper(mockPaymentChannelClaimWithCredentialIDs)
    expectSimpleRowText(wrapper, 'amount', '\uE90070.00 XRP')
    expectSimpleRowText(wrapper, 'claimed', '\uE9000.01 XRP')
    expectSimpleRowText(wrapper, 'total', '\uE90049.65716 XRP')
    expect(wrapper.find('[data-testid="credential-id-0"]')).toExist()
    expect(wrapper.find('[data-testid="credential-id-1"]')).toExist()
    expect(wrapper.find('[data-testid="credential-id-0"] .value')).toHaveText(
      '7B685088D546B9E8905D26206F452BB2F44D9A33C9BD9BCF280F7BA39015A955',
    )
    expect(wrapper.find('[data-testid="credential-id-1"] .value')).toHaveText(
      '8B685088D546B9E8905D26206F452BB2F44D9A33C9BD9BCF280F7BA39015A956',
    )
    wrapper.unmount()
  })
})
