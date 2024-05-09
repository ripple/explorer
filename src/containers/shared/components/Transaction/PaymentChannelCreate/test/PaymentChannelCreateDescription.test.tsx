import { cleanup, screen } from '@testing-library/react'
import i18n from '../../../../../../i18n/testConfigEnglish'

import { createDescriptionRenderFactory } from '../../test'
import mockPaymentChannelCreate from './mock_data/PaymentChannelCreate.json'
import mockPaymentChannelCreateFailed from './mock_data/PaymentChannelCreateFailed.json'
import mockPaymentChannelCreateWithDestinationTag from './mock_data/PaymentChannelCreateWithDestinationTag.json'
import { Description } from '../Description'

const renderComponent = createDescriptionRenderFactory(Description, i18n)

describe('PaymentChannelCreate: Description', () => {
  afterEach(cleanup)
  it('renders', () => {
    renderComponent(mockPaymentChannelCreate)
    expect(screen.getByTestId('accounts-line')).toHaveTextContent(
      `The account rJnQrhRTXutuSwtrwxYiTkHn4Dtp8sF2LM:2460331042 will create a payment channel to rUXYat4hW2M87gHoqKK7fC4cqrT9C6V7d7`,
    )
    expect(screen.getByTestId('channel-line')).toHaveTextContent(
      `The channel ID is 15AB9EE9344C42C05164E6A1F2F08B35F35D7B9D66CCB9697452B0995C8F8242`,
    )
    expect(screen.getByTestId('amount-line')).toHaveTextContent(
      `The channel amount is \uE9001.00 XRP`,
    )
    expect(screen.getByTestId('delay-line')).toHaveTextContent(
      `The channel has a settlement delay of 3,600 seconds`,
    )
    expect(screen.getByTestId('cancel-line')).not.toExist()
  })

  it('renders failed tx', () => {
    renderComponent(mockPaymentChannelCreateFailed)
    expect(screen.getByTestId('accounts-line')).toHaveTextContent(
      `The account rMphibGfHpLDU4DzVCspzLYVuMNpmzN6n8:2810223114 will create a payment channel to rK6g2UYc4GpQH8DYdPG7wywyQbxkJpQTTN`,
    )
    expect(screen.getByTestId('channel-line')).not.toExist()
    expect(screen.getByTestId('amount-line')).toHaveTextContent(
      `The channel amount is \uE90010.00 XRP`,
    )
    expect(screen.getByTestId('delay-line')).toHaveTextContent(
      `The channel has a settlement delay of 3,600 seconds`,
    )
    expect(screen.getByTestId('cancel-line')).not.toExist()
  })

  it('renders tx with destination tag', () => {
    renderComponent(mockPaymentChannelCreateWithDestinationTag)
    expect(screen.getByTestId('accounts-line')).toHaveTextContent(
      `The account rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH will create a payment channel to rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn:20170428`,
    )
    expect(screen.getByTestId('channel-line')).toHaveTextContent(
      `The channel ID is 5DB01B7FFED6B67E6B0414DED11E051D2EE2B7619CE0EAA6286D67A3A4D5BDB3`,
    )
    expect(screen.getByTestId('amount-line')).toHaveTextContent(
      `The channel amount is \uE900100.00 XRP`,
    )
    expect(screen.getByTestId('delay-line')).toHaveTextContent(
      `The channel has a settlement delay of 86,400 seconds`,
    )
    expect(screen.getByTestId('cancel-line')).not.toExist()
  })
})
