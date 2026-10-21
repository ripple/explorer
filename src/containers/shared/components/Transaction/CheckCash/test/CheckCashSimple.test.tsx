import { Simple } from '../Simple'
import mockCheckCash from './mock_data/CheckCash.json'
import mockCheckCashDeliverMin from './mock_data/CheckCashDeliverMin.json'
import { createSimpleRenderFactory } from '../../test/createWrapperFactory'

const renderComponent = createSimpleRenderFactory(Simple)

describe('CheckCash: Simple', () => {
  it('renders an exact amount', () => {
    const { container, unmount } = renderComponent(mockCheckCash)

    expect(
      container.querySelector('[data-testid="cash-amount"] .value'),
    ).toHaveTextContent('922.134841 XRP')
    expect(
      container.querySelector('[data-testid="check-id"] .value'),
    ).toHaveTextContent('2BA8B0...2380DD')
    expect(
      container.querySelector('[data-testid="deliver-min"]'),
    ).not.toBeInTheDocument()
    expect(
      container.querySelector('[data-testid="delivered"]'),
    ).not.toBeInTheDocument()
    unmount()
  })

  it('renders DeliverMin with the delivered amount', () => {
    const { container, unmount } = renderComponent(mockCheckCashDeliverMin)

    expect(
      container.querySelector('[data-testid="cash-amount"]'),
    ).not.toBeInTheDocument()
    expect(
      container.querySelector('[data-testid="deliver-min"] .value'),
    ).toHaveTextContent('900.00 XRP')
    expect(
      container.querySelector('[data-testid="delivered"] .value'),
    ).toHaveTextContent('922.134841 XRP')
    expect(
      container.querySelector('[data-testid="check-id"] .value'),
    ).toHaveTextContent('2BA8B0...2380DD')
    unmount()
  })
})
