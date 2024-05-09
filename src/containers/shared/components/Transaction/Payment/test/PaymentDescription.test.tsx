import { cleanup, screen } from '@testing-library/react'
import i18n from '../../../../../../i18n/testConfigEnglish'
import { Description } from '../Description'

import mockPayment from './mock_data/Payment.json'
import mockPaymentConvert from './mock_data/PaymentWithConvert.json'
import mockPaymentDestinationTag from './mock_data/PaymentWithDestinationTag.json'
import mockPaymentPartial from './mock_data/PaymentWithPartial.json'
import mockPaymentSendMax from './mock_data/PaymentWithSendMax.json'
import mockPaymentSourceTag from './mock_data/PaymentWithSourceTag.json'
import { createDescriptionRenderFactory } from '../../test'

const renderComponent = createDescriptionRenderFactory(Description, i18n)

describe('Payment: Description', () => {
  afterEach(cleanup)
  it('renders', () => {
    renderComponent(mockPayment)

    expect(screen.getByTestId('from-to-line')).toHaveTextContent(
      `The payment is from rNQEMJA4PsoSrZRn9J6RajAYhcDzzhf8ok to rHoPwMC75KVUhBMeV3uDMybKG5JND74teh`,
    )
    expect(screen.queryByTestId('source-tag-line')).toBeNull()
    expect(screen.queryByTestId('destination-tag-line')).toBeNull()
    expect(screen.getByTestId('amount-line')).toHaveTextContent(
      `It was instructed to deliver \uE9002,421.8268 XRP`,
    )
    expect(screen.getByTestId('delivered-line')).toHaveTextContent(
      `The actual amount delivered was \uE9002,421.8268 XRP`,
    )
  })

  it('renders with failed partial conversion', () => {
    renderComponent(mockPaymentConvert)

    expect(screen.getByTestId('from-to-line')).toHaveTextContent(
      `The payment is from r9x5PHDiwuvbpYB3uvGAqEUVV5wxHayQEx to r9x5PHDiwuvbpYB3uvGAqEUVV5wxHayQEx`,
    )
    expect(screen.queryByTestId('source-tag-line')).toBeNull()
    expect(screen.queryByTestId('destination-tag-line')).toBeNull()
    expect(screen.getByTestId('amount-line')).toHaveTextContent(
      `It was instructed to deliver up to 1,140.00 YCN.r8HgVGenRTAiNSM5iqt9PX2D2EczFZhZr by spending up to \uE9001,140.00 XRP`,
    )
    expect(screen.queryByTestId('delivered-line')).toBeNull()
  })

  it('renders with destination tag', () => {
    renderComponent(mockPaymentDestinationTag)

    expect(screen.getByTestId('from-to-line')).toHaveTextContent(
      `The payment is from rDAE53VfMvftPB4ogpWGWvzkQxfht6JPxr to rHWcuuZoFvDS6gNbmHSdpb7u1hZzxvCoMt`,
    )
    expect(screen.queryByTestId('source-tag-line')).toBeNull()
    expect(screen.getByTestId('destination-tag-line')).toHaveTextContent(
      `The destination tag is 381702`,
    )
    expect(screen.getByTestId('amount-line')).toHaveTextContent(
      `It was instructed to deliver \uE9001,531.267 XRP`,
    )
    expect(screen.getByTestId('delivered-line')).toHaveTextContent(
      `The actual amount delivered was \uE9001,531.267 XRP`,
    )
  })

  it('renders with send max', () => {
    renderComponent(mockPaymentSendMax)

    expect(screen.getByTestId('from-to-line')).toHaveTextContent(
      `The payment is from r3RaNVLvWjqqtFAawC6jbRhgKyFH7HvRS8 to rprcTynT68nYdKzDTefAZG9HjSHiYcnP4b`,
    )
    expect(screen.getByTestId('destination-tag-line')).toHaveTextContent(
      `The destination tag is 0`,
    )
    expect(screen.queryByTestId('source-tag-line')).toBeNull()
    expect(screen.getByTestId('amount-line')).toHaveTextContent(
      `It was instructed to deliver 17,366,599.150289 XRdoge.rLqUC2eCPohYvJCEBJ77eCCqVL2uEiczjA by spending up to 17,366,599.150289 XRdoge.rLqUC2eCPohYvJCEBJ77eCCqVL2uEiczjA`,
    )
    expect(screen.getByTestId('delivered-line')).toHaveTextContent(
      `The actual amount delivered was 17,366,599.150289 XRdoge.rLqUC2eCPohYvJCEBJ77eCCqVL2uEiczjA`,
    )
  })

  it('renders with partial', () => {
    renderComponent(mockPaymentPartial)

    expect(screen.getByTestId('from-to-line')).toHaveTextContent(
      `The payment is from rGTurN94Nn3RkJGSqy9MwmQCLpXZkELbnq to rMQ4oGC8fasuJwfdrfknFTttDbf8cR3D2j`,
    )
    expect(screen.getByTestId('destination-tag-line')).toHaveTextContent(
      `The destination tag is 0`,
    )
    expect(screen.queryByTestId('source-tag-line')).toBeNull()
    expect(screen.getByTestId('amount-line')).toHaveTextContent(
      `It was instructed to deliver up to 0.001043 xCoin.rXCoYSUnkpygdtfpz3Df8dKQuRZjM9UFi`,
    )
    expect(screen.getByTestId('delivered-line')).toHaveTextContent(
      `The actual amount delivered was 0.00104196 xCoin.rXCoYSUnkpygdtfpz3Df8dKQuRZjM9UFi`,
    )
  })

  it('renders with SourceTag', () => {
    renderComponent(mockPaymentSourceTag)

    expect(screen.getByTestId('source-tag-line')).toHaveTextContent(
      `The source tag is 20648`,
    )
    expect(screen.getByTestId('destination-tag-line')).toHaveTextContent(
      `The destination tag is 412453880`,
    )
  })
})
