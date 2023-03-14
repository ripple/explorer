import i18n from '../../../../../../i18n/testConfigEnglish'

import { createDescriptionWrapperFactory } from '../../test'
import mockPaymentChannelCreate from './mock_data/PaymentChannelCreate.json'
import mockPaymentChannelCreateFailed from './mock_data/PaymentChannelCreateFailed.json'
import mockPaymentChannelCreateWithDestinationTag from './mock_data/PaymentChannelCreateWithDestinationTag.json'
import { Description } from '../Description'

const createWrapper = createDescriptionWrapperFactory(Description, i18n)

describe('PaymentChannelCreate: Description', () => {
  it('renders', () => {
    const wrapper = createWrapper(mockPaymentChannelCreate)
    expect(wrapper.find('[data-test="accounts-line"]')).toHaveText(
      `The account rJnQrhRTXutuSwtrwxYiTkHn4Dtp8sF2LM:2460331042 will create a payment channel to rUXYat4hW2M87gHoqKK7fC4cqrT9C6V7d7`,
    )
    expect(wrapper.find('[data-test="channel-line"]')).toHaveText(
      `The channel ID is 15AB9EE9344C42C05164E6A1F2F08B35F35D7B9D66CCB9697452B0995C8F8242`,
    )
    expect(wrapper.find('[data-test="amount-line"]')).toHaveText(
      `The channel amount is \uE9001.00 XRP`,
    )
    expect(wrapper.find('[data-test="delay-line"]')).toHaveText(
      `The channel has a settlement delay of 3,600 seconds`,
    )
    expect(wrapper.find('[data-test="cancel-line"]')).not.toExist()
    wrapper.unmount()
  })

  it('renders failed tx', () => {
    const wrapper = createWrapper(mockPaymentChannelCreateFailed)
    expect(wrapper.find('[data-test="accounts-line"]')).toHaveText(
      `The account rMphibGfHpLDU4DzVCspzLYVuMNpmzN6n8:2810223114 will create a payment channel to rK6g2UYc4GpQH8DYdPG7wywyQbxkJpQTTN`,
    )
    expect(wrapper.find('[data-test="channel-line"]')).not.toExist()
    expect(wrapper.find('[data-test="amount-line"]')).toHaveText(
      `The channel amount is \uE90010.00 XRP`,
    )
    expect(wrapper.find('[data-test="delay-line"]')).toHaveText(
      `The channel has a settlement delay of 3,600 seconds`,
    )
    expect(wrapper.find('[data-test="cancel-line"]')).not.toExist()
    wrapper.unmount()
  })

  it('renders tx with destination tag', () => {
    const wrapper = createWrapper(mockPaymentChannelCreateWithDestinationTag)
    expect(wrapper.find('[data-test="accounts-line"]')).toHaveText(
      `The account rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH will create a payment channel to rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn:20170428`,
    )
    expect(wrapper.find('[data-test="channel-line"]')).toHaveText(
      `The channel ID is 5DB01B7FFED6B67E6B0414DED11E051D2EE2B7619CE0EAA6286D67A3A4D5BDB3`,
    )
    expect(wrapper.find('[data-test="amount-line"]')).toHaveText(
      `The channel amount is \uE900100.00 XRP`,
    )
    expect(wrapper.find('[data-test="delay-line"]')).toHaveText(
      `The channel has a settlement delay of 86,400 seconds`,
    )
    expect(wrapper.find('[data-test="cancel-line"]')).not.toExist()
    wrapper.unmount()
  })
})
