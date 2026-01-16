import i18n from '../../../../../../i18n/testConfigEnglish'

import { createTableDetailRenderFactory } from '../../test'
import mockPaymentChannelCreate from './mock_data/PaymentChannelCreate.json'
import mockPaymentChannelCreateFailed from './mock_data/PaymentChannelCreateFailed.json'
import mockPaymentChannelCreateWithDestinationTag from './mock_data/PaymentChannelCreateWithDestinationTag.json'
import { TableDetail } from '../TableDetail'

const renderComponent = createTableDetailRenderFactory(TableDetail, i18n)

describe('PaymentChannelCreate: TableDetail', () => {
  it('renders', () => {
    const { container, unmount } = renderComponent(mockPaymentChannelCreate)
    expect(container.querySelector('[data-testid="source"]')).toHaveTextContent(
      'sourcerJnQrhRTXutuSwtrwxYiTkHn4Dtp8sF2LM:2460331042',
    )
    expect(
      container.querySelector('[data-testid="destination"]'),
    ).toHaveTextContent('destinationrUXYat4hW2M87gHoqKK7fC4cqrT9C6V7d7')
    expect(container.querySelector('[data-testid="amount"]')).toHaveTextContent(
      '\uE9001.00 XRP',
    )
    unmount()
  })

  it('renders failed tx', () => {
    const { container, unmount } = renderComponent(
      mockPaymentChannelCreateFailed,
    )
    expect(container.querySelector('[data-testid="source"]')).toHaveTextContent(
      'sourcerMphibGfHpLDU4DzVCspzLYVuMNpmzN6n8:2810223114',
    )
    expect(
      container.querySelector('[data-testid="destination"]'),
    ).toHaveTextContent('destinationrK6g2UYc4GpQH8DYdPG7wywyQbxkJpQTTN')
    expect(container.querySelector('[data-testid="amount"]')).toHaveTextContent(
      '\uE90010.00 XRP',
    )
    unmount()
  })

  it('renders tx with destination tag', () => {
    const { container, unmount } = renderComponent(
      mockPaymentChannelCreateWithDestinationTag,
    )
    expect(container.querySelector('[data-testid="source"]')).toHaveTextContent(
      'sourcerN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH',
    )
    expect(
      container.querySelector('[data-testid="destination"]'),
    ).toHaveTextContent(
      'destinationrf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn:20170428',
    )
    expect(container.querySelector('[data-testid="amount"]')).toHaveTextContent(
      '\uE900100.00 XRP',
    )
    unmount()
  })
})
