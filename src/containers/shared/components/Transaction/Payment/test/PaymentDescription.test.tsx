import i18n from '../../../../../../i18n/testConfigEnglish'
import { Description } from '../Description'

import mockPayment from './mock_data/Payment.json'
import mockPaymentConvert from './mock_data/PaymentWithConvert.json'
import mockPaymentDestinationTag from './mock_data/PaymentWithDestinationTag.json'
import mockPaymentPartial from './mock_data/PaymentWithPartial.json'
import mockPaymentSendMax from './mock_data/PaymentWithSendMax.json'
import mockPaymentSourceTag from './mock_data/PaymentWithSourceTag.json'
import { createDescriptionRenderFactory } from '../../test'

const createWrapper = createDescriptionRenderFactory(Description, i18n)

describe('Payment: Description', () => {
  it('renders', () => {
    const wrapper = createWrapper(mockPayment)

    expect(wrapper.find('[data-testid="from-to-line"]')).toHaveText(
      `The payment is from rNQEMJA4PsoSrZRn9J6RajAYhcDzzhf8ok to rHoPwMC75KVUhBMeV3uDMybKG5JND74teh`,
    )
    expect(wrapper.find('[data-testid="source-tag-line"]')).not.toExist()
    expect(wrapper.find('[data-testid="destination-tag-line"]')).not.toExist()
    expect(wrapper.find('[data-testid="amount-line"]')).toHaveText(
      `It was instructed to deliver \uE9002,421.8268 XRP`,
    )
    expect(wrapper.find('[data-testid="delivered-line"]')).toHaveText(
      `The actual amount delivered was \uE9002,421.8268 XRP`,
    )

    wrapper.unmount()
  })

  it('renders with failed partial conversion', () => {
    const wrapper = createWrapper(mockPaymentConvert)

    expect(wrapper.find('[data-testid="from-to-line"]')).toHaveText(
      `The payment is from r9x5PHDiwuvbpYB3uvGAqEUVV5wxHayQEx to r9x5PHDiwuvbpYB3uvGAqEUVV5wxHayQEx`,
    )
    expect(wrapper.find('[data-testid="source-tag-line"]')).not.toExist()
    expect(wrapper.find('[data-testid="destination-tag-line"]')).not.toExist()
    expect(wrapper.find('[data-testid="amount-line"]')).toHaveText(
      `It was instructed to deliver up to 1,140.00 YCN.r8HgVGenRTAiNSM5iqt9PX2D2EczFZhZr by spending up to \uE9001,140.00 XRP`,
    )
    expect(wrapper.find('[data-testid="delivered-line"]')).not.toExist()

    wrapper.unmount()
  })

  it('renders with destination tag', () => {
    const wrapper = createWrapper(mockPaymentDestinationTag)

    expect(wrapper.find('[data-testid="from-to-line"]')).toHaveText(
      `The payment is from rDAE53VfMvftPB4ogpWGWvzkQxfht6JPxr to rHWcuuZoFvDS6gNbmHSdpb7u1hZzxvCoMt`,
    )
    expect(wrapper.find('[data-testid="source-tag-line"]')).not.toExist()
    expect(wrapper.find('[data-testid="destination-tag-line"]')).toHaveText(
      `The destination tag is 381702`,
    )
    expect(wrapper.find('[data-testid="amount-line"]')).toHaveText(
      `It was instructed to deliver \uE9001,531.267 XRP`,
    )
    expect(wrapper.find('[data-testid="delivered-line"]')).toHaveText(
      `The actual amount delivered was \uE9001,531.267 XRP`,
    )

    wrapper.unmount()
  })

  it('renders with send max', () => {
    const wrapper = createWrapper(mockPaymentSendMax)

    expect(wrapper.find('[data-testid="from-to-line"]')).toHaveText(
      `The payment is from r3RaNVLvWjqqtFAawC6jbRhgKyFH7HvRS8 to rprcTynT68nYdKzDTefAZG9HjSHiYcnP4b`,
    )
    expect(wrapper.find('[data-testid="destination-tag-line"]')).toHaveText(
      `The destination tag is 0`,
    )
    expect(wrapper.find('[data-testid="source-tag-line"]')).not.toExist()
    expect(wrapper.find('[data-testid="amount-line"]')).toHaveText(
      `It was instructed to deliver 17,366,599.150289 XRdoge.rLqUC2eCPohYvJCEBJ77eCCqVL2uEiczjA by spending up to 17,366,599.150289 XRdoge.rLqUC2eCPohYvJCEBJ77eCCqVL2uEiczjA`,
    )
    expect(wrapper.find('[data-testid="delivered-line"]')).toHaveText(
      `The actual amount delivered was 17,366,599.150289 XRdoge.rLqUC2eCPohYvJCEBJ77eCCqVL2uEiczjA`,
    )
    wrapper.unmount()
  })

  it('renders with partial', () => {
    const wrapper = createWrapper(mockPaymentPartial)

    expect(wrapper.find('[data-testid="from-to-line"]')).toHaveText(
      `The payment is from rGTurN94Nn3RkJGSqy9MwmQCLpXZkELbnq to rMQ4oGC8fasuJwfdrfknFTttDbf8cR3D2j`,
    )
    expect(wrapper.find('[data-testid="destination-tag-line"]')).toHaveText(
      `The destination tag is 0`,
    )
    expect(wrapper.find('[data-testid="source-tag-line"]')).not.toExist()
    expect(wrapper.find('[data-testid="amount-line"]')).toHaveText(
      `It was instructed to deliver up to 0.001043 xCoin.rXCoYSUnkpygdtfpz3Df8dKQuRZjM9UFi`,
    )
    expect(wrapper.find('[data-testid="delivered-line"]')).toHaveText(
      `The actual amount delivered was 0.00104196 xCoin.rXCoYSUnkpygdtfpz3Df8dKQuRZjM9UFi`,
    )

    wrapper.unmount()
  })

  it('renders with SourceTag', () => {
    const wrapper = createWrapper(mockPaymentSourceTag)

    expect(wrapper.find('[data-testid="source-tag-line"]')).toHaveText(
      `The source tag is 20648`,
    )
    expect(wrapper.find('[data-testid="destination-tag-line"]')).toHaveText(
      `The destination tag is 412453880`,
    )

    wrapper.unmount()
  })
})
