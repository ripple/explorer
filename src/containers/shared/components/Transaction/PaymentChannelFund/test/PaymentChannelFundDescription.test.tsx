import i18n from '../../../../../../i18n/testConfigEnglish'

import { createDescriptionRenderFactory } from '../../test/createWrapperFactory'
import mockPaymentChannelFund from './mock_data/PaymentChannelFund.json'
import mockPaymentChannelFundFailed from './mock_data/PaymentChannelFundFailed.json'
import { Description } from '../Description'

const renderComponent = createDescriptionRenderFactory(Description, i18n)

describe('PaymentChannelFund: Description', () => {
  it('renders a Fund', () => {
    const { container, unmount } = renderComponent(mockPaymentChannelFund)
    expect(
      container.querySelector('[data-testid="channel-line"]'),
    ).toHaveTextContent(
      `It will update the payment channel 4BEAC9E4C10674AB698EAC0F2D78A4FF507428370578A59B04883E7EB8D82260`,
    )
    expect(
      container.querySelector('[data-testid="amount-line"]'),
    ).toHaveTextContent(
      `It will increase the channel amount by \uE9001.00 XRP from \uE90074.00 XRP to \uE90075.00 XRP`,
    )
    unmount()
  })

  it('renders failed tx', () => {
    const { container, unmount } = renderComponent(mockPaymentChannelFundFailed)
    expect(
      container.querySelector('[data-testid="channel-line"]'),
    ).toHaveTextContent(
      `It will update the payment channel 933F93F7113A2F94B7838D64D0D2A244C57EFD6411C16FFF5FA293D200EF5876`,
    )
    expect(
      container.querySelector('[data-testid="amount-line"]'),
    ).toHaveTextContent(
      `It will increase the channel amount by \uE90020.00 XRP`,
    )
    unmount()
  })
})
