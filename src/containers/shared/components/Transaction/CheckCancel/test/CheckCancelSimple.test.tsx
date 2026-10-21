import { Simple } from '../Simple'
import mockCheckCancel from './mock_data/CheckCancel.json'
import { createSimpleRenderFactory } from '../../test/createWrapperFactory'

const renderComponent = createSimpleRenderFactory(Simple)

describe('CheckCancel: Simple', () => {
  it('renders', () => {
    const { container, unmount } = renderComponent(mockCheckCancel)

    expect(
      container.querySelector('[data-testid="check-id"] .value'),
    ).toHaveTextContent('2BA8B0...2380DD')
    unmount()
  })
})
