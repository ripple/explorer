import { createTableDetailRenderFactory } from '../../test'
import { TableDetail } from '../TableDetail'
import mockPayment from './mock_data/Payment.json'
import mockPaymentConvert from './mock_data/PaymentWithConvert.json'
import mockPaymentDestinationTag from './mock_data/PaymentWithDestinationTag.json'
import mockPaymentPartial from './mock_data/PaymentWithPartial.json'
import mockPaymentSendMax from './mock_data/PaymentWithSendMax.json'
import mockPaymentSourceTag from './mock_data/PaymentWithSourceTag.json'
import mockPermDomainID from './mock_data/PaymentWithPermDomainID.json'
import mockPaymentCredentialIDs from './mock_data/PaymentWithCredentialIDs.json'

const renderComponent = createTableDetailRenderFactory(TableDetail)

describe('Payment: TableDetail', () => {
  it('renders', () => {
    const { container, unmount } = renderComponent(mockPayment)

    // styling makes this look okay
    expect(container.querySelector('.payment')).toHaveTextContent(
      `send\uE9002,421.8268 XRPtorHoPwMC75KVUhBMeV3uDMybKG5JND74teh`,
    )

    unmount()
  })

  it('renders with failed partial conversion', () => {
    const { container, unmount } = renderComponent(mockPaymentConvert)

    // styling makes this look okay
    expect(container.querySelector('.payment')).toHaveTextContent(
      `convert_maximum1,140.00 XRPto0.00 YCN.r8HgVGenRTAiNSM5iqt9PX2D2EczFZhZrpartial_payment_allowed`,
    )

    unmount()
  })

  it('renders with destination tag', () => {
    const { container, unmount } = renderComponent(mockPaymentDestinationTag)

    // styling makes this look okay
    expect(container.querySelector('.payment')).toHaveTextContent(
      `send1,531.267 XRPtorHWcuuZoFvDS6gNbmHSdpb7u1hZzxvCoMt:381702`,
    )

    unmount()
  })

  it('renders with send max', () => {
    const { container, unmount } = renderComponent(mockPaymentSendMax)

    // styling makes this look okay
    expect(container.querySelector('.payment')).toHaveTextContent(
      `send17,366,599.150289 XRdoge.rLqUC2eCPohYvJCEBJ77eCCqVL2uEiczjAtorprcTynT68nYdKzDTefAZG9HjSHiYcnP4b:0`,
    )

    unmount()
  })

  it('renders with partial', () => {
    const { container, unmount } = renderComponent(mockPaymentPartial)

    // styling makes this look okay
    expect(container.querySelector('.payment')).toHaveTextContent(
      `send0.00104196 xCoin.rXCoYSUnkpygdtfpz3Df8dKQuRZjM9UFitorMQ4oGC8fasuJwfdrfknFTttDbf8cR3D2j:0partial_payment_allowed`,
    )

    unmount()
  })

  it('renders with SourceTag', () => {
    const { container, unmount } = renderComponent(mockPaymentSourceTag)

    expect(container.querySelector('.st')).toHaveTextContent(
      'source_tag: 20648',
    )

    unmount()
  })

  it(`renders with Permissioned Domain ID`, () => {
    const { container, unmount } = renderComponent(mockPermDomainID)

    expect(container.querySelector('.domain-id')).toHaveTextContent(
      `domain_id: D3261DF48CDA3B860ED3FA99F02138856393CD44556E028D5CB66192A18A8D02`,
    )
  })

  it('renders with CredentialIDs', () => {
    const { container, unmount } = renderComponent(mockPaymentCredentialIDs)

    expect(container.querySelector('.credential-ids')).toBeInTheDocument()
    expect(container.querySelector('.credential-ids .label')).toHaveTextContent(
      'credential_ids:',
    )
    const credentialIds = container.querySelectorAll('.credential-id')
    expect(credentialIds).toHaveLength(2)
    expect(credentialIds[0]).toHaveTextContent(
      '7B685088D546B9E8905D26206F452BB2F44D9A33C9BD9BCF280F7BA39015A955',
    )
    expect(credentialIds[1]).toHaveTextContent(
      '8B685088D546B9E8905D26206F452BB2F44D9A33C9BD9BCF280F7BA39015A956',
    )

    unmount()
  })
})
