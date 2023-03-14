import i18n from '../../../../../../i18n/testConfigEnglish'

import { createDescriptionWrapperFactory } from '../../test/createWrapperFactory'
import mockPaymentChannelFund from './mock_data/PaymentChannelFund.json'
import mockPaymentChannelFundFailed from './mock_data/PaymentChannelFundFailed.json'
import { Description } from '../Description'

const createWrapper = createDescriptionWrapperFactory(Description, i18n)

describe('PaymentChannelFund: Description', () => {
  it('renders a Fund', () => {
    const wrapper = createWrapper(mockPaymentChannelFund)
    expect(wrapper.find('[data-test="channel-line"]')).toHaveText(
      `It will update the payment channel 4BEAC9E4C10674AB698EAC0F2D78A4FF507428370578A59B04883E7EB8D82260`,
    )
    expect(wrapper.find('[data-test="amount-line"]')).toHaveText(
      `It will increase the channel amount by \uE9001.00 XRP from \uE90074.00 XRP to \uE90075.00 XRP`,
    )
    wrapper.unmount()
  })

  it('renders failed tx', () => {
    const wrapper = createWrapper(mockPaymentChannelFundFailed)
    expect(wrapper.find('[data-test="channel-line"]')).toHaveText(
      `It will update the payment channel 933F93F7113A2F94B7838D64D0D2A244C57EFD6411C16FFF5FA293D200EF5876`,
    )
    expect(wrapper.find('[data-test="amount-line"]')).toHaveText(
      `It will increase the channel amount by \uE90020.00 XRP`,
    )
    wrapper.unmount()
  })
})
