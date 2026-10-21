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
    expect(
      container.querySelector('[data-testid="check-tx"] a'),
    ).toHaveTextContent('D901FB...AC74A4')
    expect(
      container.querySelector('[data-testid="check-tx"] a'),
    ).toHaveAttribute(
      'href',
      '/transactions/D901FB5DF080B89E2A4A9F6989D6B0D2F3F88A0CDADF114A531BD52A91AC74A4',
    )
    unmount()
  })
})
