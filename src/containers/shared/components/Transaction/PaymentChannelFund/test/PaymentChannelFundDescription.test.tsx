import i18n from '../../../../../../i18n/testConfigEnglish'

import { createDescriptionRenderFactory } from '../../test/createRenderFactory'
import mockPaymentChannelFund from './mock_data/PaymentChannelFund.json'
import mockPaymentChannelFundFailed from './mock_data/PaymentChannelFundFailed.json'
import { Description } from '../Description'

const renderComponent = createDescriptionRenderFactory(Description, i18n)

describe('PaymentChannelFund: Description', () => {
  afterEach(cleanup)
  it('renders a Fund', () => {
    renderComponent(mockPaymentChannelFund)
    expect(wrapper.find('[data-testid="channel-line"]')).toHaveText(
      `It will update the payment channel 4BEAC9E4C10674AB698EAC0F2D78A4FF507428370578A59B04883E7EB8D82260`,
    )
    expect(wrapper.find('[data-testid="amount-line"]')).toHaveText(
      `It will increase the channel amount by \uE9001.00 XRP from \uE90074.00 XRP to \uE90075.00 XRP`,
    )
    wrapper.unmount()
  })

  it('renders failed tx', () => {
    renderComponent(mockPaymentChannelFundFailed)
    expect(wrapper.find('[data-testid="channel-line"]')).toHaveText(
      `It will update the payment channel 933F93F7113A2F94B7838D64D0D2A244C57EFD6411C16FFF5FA293D200EF5876`,
    )
    expect(wrapper.find('[data-testid="amount-line"]')).toHaveText(
      `It will increase the channel amount by \uE90020.00 XRP`,
    )
    wrapper.unmount()
  })
})
