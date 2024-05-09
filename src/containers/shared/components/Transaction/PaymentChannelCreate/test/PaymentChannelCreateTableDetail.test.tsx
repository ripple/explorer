import { cleanup, screen } from '@testing-library/react'
import i18n from '../../../../../../i18n/testConfigEnglish'

import { createTableDetailRenderFactory } from '../../test'
import mockPaymentChannelCreate from './mock_data/PaymentChannelCreate.json'
import mockPaymentChannelCreateFailed from './mock_data/PaymentChannelCreateFailed.json'
import mockPaymentChannelCreateWithDestinationTag from './mock_data/PaymentChannelCreateWithDestinationTag.json'
import { TableDetail } from '../TableDetail'

const renderComponent = createTableDetailRenderFactory(TableDetail, i18n)

describe('PaymentChannelCreate: TableDetail', () => {
  afterEach(cleanup)
  it('renders', () => {
    renderComponent(mockPaymentChannelCreate)
    expect(wrapper.find('[data-testid="source"]')).toHaveText(
      'sourcerJnQrhRTXutuSwtrwxYiTkHn4Dtp8sF2LM:2460331042',
    )
    expect(wrapper.find('[data-testid="destination"]')).toHaveText(
      'destinationrUXYat4hW2M87gHoqKK7fC4cqrT9C6V7d7',
    )
    expect(wrapper.find('[data-testid="amount"]')).toHaveText('\uE9001.00 XRP')
    wrapper.unmount()
  })

  it('renders failed tx', () => {
    renderComponent(mockPaymentChannelCreateFailed)
    expect(wrapper.find('[data-testid="source"]')).toHaveText(
      'sourcerMphibGfHpLDU4DzVCspzLYVuMNpmzN6n8:2810223114',
    )
    expect(wrapper.find('[data-testid="destination"]')).toHaveText(
      'destinationrK6g2UYc4GpQH8DYdPG7wywyQbxkJpQTTN',
    )
    expect(wrapper.find('[data-testid="amount"]')).toHaveText('\uE90010.00 XRP')
    wrapper.unmount()
  })

  it('renders tx with destination tag', () => {
    renderComponent(mockPaymentChannelCreateWithDestinationTag)
    expect(wrapper.find('[data-testid="source"]')).toHaveText(
      'sourcerN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH',
    )
    expect(wrapper.find('[data-testid="destination"]')).toHaveText(
      'destinationrf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn:20170428',
    )
    expect(wrapper.find('[data-testid="amount"]')).toHaveText(
      '\uE900100.00 XRP',
    )
    wrapper.unmount()
  })
})
