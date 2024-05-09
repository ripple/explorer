import i18n from '../../../../../../i18n/testConfigEnglish'

import { createDescriptionRenderFactory } from '../../test/createRenderFactory'
import mockPaymentChannelClaim from './mock_data/PaymentChannelClaim.json'
import mockPaymentChannelClaimClosed from './mock_data/PaymentChannelClaimClosed.json'
import mockPaymentChannelClaimCloseDenied from './mock_data/PaymentChannelClaimCloseDenied.json'
import mockPaymentChannelClaimWithDestinationTag from './mock_data/PaymentChannelClaimWithDestinationTag.json'
import { Description } from '../Description'

const createWrapper = createDescriptionRenderFactory(Description, i18n)

describe('PaymentChannelClaim: Description', () => {
  it('renders a claim', () => {
    const wrapper = createWrapper(mockPaymentChannelClaim)
    expect(wrapper.find('[data-testid="account-line"]')).toHaveText(
      `The transaction was initiated by rK6g2UYc4GpQH8DYdPG7wywyQbxkJpQTTN`,
    )
    expect(wrapper.find('[data-testid="channel-line"]')).toHaveText(
      `It will update the payment channel 50107651E7163E294CE0EAD8A20BF7CC046304480FCC9C74A49FFAB3F46FB98E`,
    )
    expect(wrapper.find('[data-testid="balance-line"]')).toHaveText(
      `The channel balance claimed is \uE90049.65716XRP (increased by \uE9000.01XRP)`,
    )
    expect(wrapper.find('[data-testid="closed-line"]')).not.toExist()
    wrapper.unmount()
  })

  it('renders tx with channel being closed', () => {
    const wrapper = createWrapper(mockPaymentChannelClaimClosed)
    expect(wrapper.find('[data-testid="account-line"]')).toHaveText(
      `The transaction was initiated by rH11fDGhbVH5NVXNXkGAMTmfWhUHjCtA3B`,
    )
    expect(wrapper.find('[data-testid="channel-line"]')).toHaveText(
      `It will update the payment channel 3BDB4F92432BCEB2385D3BAA60E8AAEC9B552890A240AEE4AA9E88C9E6C517E8`,
    )
    expect(wrapper.find('[data-testid="balance-line"]')).not.toExist()
    expect(wrapper.find('[data-testid="closed-line"]')).toHaveText(
      `The payment channel will be closed, any remaining balance will be returned to the source account`,
    )
    wrapper.unmount()
  })

  it('renders tx requesting channel be closed but not closing it', () => {
    const wrapper = createWrapper(mockPaymentChannelClaimCloseDenied)
    expect(wrapper.find('[data-testid="account-line"]')).toHaveText(
      `The transaction was initiated by rH11fDGhbVH5NVXNXkGAMTmfWhUHjCtA3B`,
    )
    expect(wrapper.find('[data-testid="channel-line"]')).toHaveText(
      `It will update the payment channel 3BDB4F92432BCEB2385D3BAA60E8AAEC9B552890A240AEE4AA9E88C9E6C517E8`,
    )
    expect(wrapper.find('[data-testid="balance-line"]')).not.toExist()
    expect(wrapper.find('[data-testid="closed-line"]')).not.toExist()
    wrapper.unmount()
  })

  it('renders tx with destination tag', () => {
    const wrapper = createWrapper(mockPaymentChannelClaimWithDestinationTag)
    expect(wrapper.find('[data-testid="account-line"]')).toHaveText(
      `The transaction was initiated by rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn`,
    )
    expect(wrapper.find('[data-testid="channel-line"]')).toHaveText(
      `It will update the payment channel 5DB01B7FFED6B67E6B0414DED11E051D2EE2B7619CE0EAA6286D67A3A4D5BDB3`,
    )
    expect(wrapper.find('[data-testid="balance-line"]')).toHaveText(
      `The channel balance claimed is \uE9001.00XRP (increased by \uE9001.00XRP)`,
    )
    expect(wrapper.find('[data-testid="closed-line"]')).not.toExist()
    wrapper.unmount()
  })
})
