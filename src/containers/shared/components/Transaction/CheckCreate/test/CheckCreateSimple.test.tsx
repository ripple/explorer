import { Simple } from '../Simple'
import mockCheckCreate from './mock_data/CheckCreate.json'
import mockCheckCreateWithOptionalFields from './mock_data/CheckCreateWithOptionalFields.json'
import mockCheckCreateFailed from './mock_data/CheckCreateFailed.json'
import { createSimpleRenderFactory } from '../../test/createWrapperFactory'

const renderComponent = createSimpleRenderFactory(Simple)

describe('CheckCreate: Simple', () => {
  it('renders', () => {
    const { container, unmount } = renderComponent(mockCheckCreate)

    expect(
      container.querySelector('[data-testid="send-max"] .value'),
    ).toHaveTextContent('1,844.800818 XRP')
    expect(
      container.querySelector('[data-testid="destination"] .value'),
    ).toHaveTextContent('rDkirQ9393dw6om8J999UWpxxg2yhSQeRF')
    expect(
      container.querySelector('[data-testid="check-id"] .value'),
    ).toHaveTextContent('8C1AB3...3A9676')
    expect(
      container.querySelector('[data-testid="expiration"]'),
    ).not.toBeInTheDocument()
    expect(
      container.querySelector('[data-testid="invoice-id"]'),
    ).not.toBeInTheDocument()
    unmount()
  })

  it('renders optional fields and an IOU limit', () => {
    const { container, unmount } = renderComponent(
      mockCheckCreateWithOptionalFields,
    )

    expect(
      container.querySelector('[data-testid="send-max"] .value'),
    ).toHaveTextContent('125.50 USD.rhub8VRN55s94qWKDv6jmDy1pUykJzF3wq')
    expect(
      container.querySelector('[data-testid="destination"] .value'),
    ).toHaveTextContent('rDkirQ9393dw6om8J999UWpxxg2yhSQeRF:12345')
    expect(
      container.querySelector('[data-testid="expiration"] .value'),
    ).toHaveTextContent('October 22, 2026 at 4:00:00 PM UTC')
    expect(
      container.querySelector('[data-testid="invoice-id"] .value'),
    ).toHaveTextContent(
      '6F1DFD1D0FE8A32E40E1F2C05CF1C15545BAB56B617F9C6C2D63A6B704BEF59B',
    )
    expect(
      container.querySelector('[data-testid="check-id"] .value'),
    ).toHaveTextContent('8C1AB3...3A9676')
    unmount()
  })

  it('renders a failed CheckCreate without a Check ID', () => {
    const { container, unmount } = renderComponent(mockCheckCreateFailed)

    expect(
      container.querySelector('[data-testid="destination"] .value'),
    ).toHaveTextContent('rDkirQ9393dw6om8J999UWpxxg2yhSQeRF:0')
    expect(
      container.querySelector('[data-testid="check-id"]'),
    ).not.toBeInTheDocument()
    unmount()
  })
})
