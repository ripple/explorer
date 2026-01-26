import i18n from '../../../../../../i18n/testConfigEnglish'
import { Description } from '../Description'

import mockPayment from './mock_data/Payment.json'
import mockPaymentConvert from './mock_data/PaymentWithConvert.json'
import mockPaymentDestinationTag from './mock_data/PaymentWithDestinationTag.json'
import mockPaymentPartial from './mock_data/PaymentWithPartial.json'
import mockPaymentSendMax from './mock_data/PaymentWithSendMax.json'
import mockPaymentSourceTag from './mock_data/PaymentWithSourceTag.json'
import mockPermDomainID from './mock_data/PaymentWithPermDomainID.json'
import { createDescriptionRenderFactory } from '../../test'

const renderComponent = createDescriptionRenderFactory(Description, i18n)

describe('Payment: Description', () => {
  it('renders', () => {
    const { container, unmount } = renderComponent(mockPayment)

    expect(
      container.querySelector('[data-testid="from-to-line"]'),
    ).toHaveTextContent(
      `The payment is from rNQEMJA4PsoSrZRn9J6RajAYhcDzzhf8ok to rHoPwMC75KVUhBMeV3uDMybKG5JND74teh`,
    )
    expect(
      container.querySelector('[data-testid="source-tag-line"]'),
    ).not.toBeInTheDocument()
    expect(
      container.querySelector('[data-testid="destination-tag-line"]'),
    ).not.toBeInTheDocument()
    expect(
      container.querySelector('[data-testid="amount-line"]'),
    ).toHaveTextContent(`It was instructed to deliver \uE9002,421.8268 XRP`)
    expect(
      container.querySelector('[data-testid="delivered-line"]'),
    ).toHaveTextContent(`The actual amount delivered was \uE9002,421.8268 XRP`)

    unmount()
  })

  it('renders with failed partial conversion', () => {
    const { container, unmount } = renderComponent(mockPaymentConvert)

    expect(
      container.querySelector('[data-testid="from-to-line"]'),
    ).toHaveTextContent(
      `The payment is from r9x5PHDiwuvbpYB3uvGAqEUVV5wxHayQEx to r9x5PHDiwuvbpYB3uvGAqEUVV5wxHayQEx`,
    )
    expect(
      container.querySelector('[data-testid="source-tag-line"]'),
    ).not.toBeInTheDocument()
    expect(
      container.querySelector('[data-testid="destination-tag-line"]'),
    ).not.toBeInTheDocument()
    expect(
      container.querySelector('[data-testid="amount-line"]'),
    ).toHaveTextContent(
      `It was instructed to deliver up to 1,140.00 YCN.r8HgVGenRTAiNSM5iqt9PX2D2EczFZhZr by spending up to \uE9001,140.00 XRP`,
    )
    expect(
      container.querySelector('[data-testid="delivered-line"]'),
    ).not.toBeInTheDocument()

    unmount()
  })

  it('renders with destination tag', () => {
    const { container, unmount } = renderComponent(mockPaymentDestinationTag)

    expect(
      container.querySelector('[data-testid="from-to-line"]'),
    ).toHaveTextContent(
      `The payment is from rDAE53VfMvftPB4ogpWGWvzkQxfht6JPxr to rHWcuuZoFvDS6gNbmHSdpb7u1hZzxvCoMt`,
    )
    expect(
      container.querySelector('[data-testid="source-tag-line"]'),
    ).not.toBeInTheDocument()
    expect(
      container.querySelector('[data-testid="destination-tag-line"]'),
    ).toHaveTextContent(`The destination tag is 381702`)
    expect(
      container.querySelector('[data-testid="amount-line"]'),
    ).toHaveTextContent(`It was instructed to deliver \uE9001,531.267 XRP`)
    expect(
      container.querySelector('[data-testid="delivered-line"]'),
    ).toHaveTextContent(`The actual amount delivered was \uE9001,531.267 XRP`)

    unmount()
  })

  it('renders with send max', () => {
    const { container, unmount } = renderComponent(mockPaymentSendMax)

    expect(
      container.querySelector('[data-testid="from-to-line"]'),
    ).toHaveTextContent(
      `The payment is from r3RaNVLvWjqqtFAawC6jbRhgKyFH7HvRS8 to rprcTynT68nYdKzDTefAZG9HjSHiYcnP4b`,
    )
    expect(
      container.querySelector('[data-testid="destination-tag-line"]'),
    ).toHaveTextContent(`The destination tag is 0`)
    expect(
      container.querySelector('[data-testid="source-tag-line"]'),
    ).not.toBeInTheDocument()
    expect(
      container.querySelector('[data-testid="amount-line"]'),
    ).toHaveTextContent(
      `It was instructed to deliver 17,366,599.150289 XRdoge.rLqUC2eCPohYvJCEBJ77eCCqVL2uEiczjA by spending up to 17,366,599.150289 XRdoge.rLqUC2eCPohYvJCEBJ77eCCqVL2uEiczjA`,
    )
    expect(
      container.querySelector('[data-testid="delivered-line"]'),
    ).toHaveTextContent(
      `The actual amount delivered was 17,366,599.150289 XRdoge.rLqUC2eCPohYvJCEBJ77eCCqVL2uEiczjA`,
    )
    unmount()
  })

  it('renders with partial', () => {
    const { container, unmount } = renderComponent(mockPaymentPartial)

    expect(
      container.querySelector('[data-testid="from-to-line"]'),
    ).toHaveTextContent(
      `The payment is from rGTurN94Nn3RkJGSqy9MwmQCLpXZkELbnq to rMQ4oGC8fasuJwfdrfknFTttDbf8cR3D2j`,
    )
    expect(
      container.querySelector('[data-testid="destination-tag-line"]'),
    ).toHaveTextContent(`The destination tag is 0`)
    expect(
      container.querySelector('[data-testid="source-tag-line"]'),
    ).not.toBeInTheDocument()
    expect(
      container.querySelector('[data-testid="amount-line"]'),
    ).toHaveTextContent(
      `It was instructed to deliver up to 0.001043 xCoin.rXCoYSUnkpygdtfpz3Df8dKQuRZjM9UFi`,
    )
    expect(
      container.querySelector('[data-testid="delivered-line"]'),
    ).toHaveTextContent(
      `The actual amount delivered was 0.00104196 xCoin.rXCoYSUnkpygdtfpz3Df8dKQuRZjM9UFi`,
    )

    unmount()
  })

  it('renders with SourceTag', () => {
    const { container, unmount } = renderComponent(mockPaymentSourceTag)

    expect(
      container.querySelector('[data-testid="source-tag-line"]'),
    ).toHaveTextContent(`The source tag is 20648`)
    expect(
      container.querySelector('[data-testid="destination-tag-line"]'),
    ).toHaveTextContent(`The destination tag is 412453880`)

    unmount()
  })

  it(`renders with Permissioned Domain ID`, () => {
    const { container } = renderComponent(mockPermDomainID)

    expect(
      container.querySelector('[data-testid="domain-id-line"]'),
    ).toHaveTextContent(
      `Domain ID: D3261DF48CDA3B860ED3FA99F02138856393CD44556E028D5CB66192A18A8D02`,
    )
  })
})
