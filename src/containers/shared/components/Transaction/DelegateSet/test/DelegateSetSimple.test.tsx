import { expectSimpleRowText, createSimpleRenderFactory } from '../../test'
import { Simple } from '../Simple'
import mockDelegateSet from './mock_data/DelegateSet.json'

const renderComponent = createSimpleRenderFactory(Simple)

describe('DelegateSet: Simple', () => {
  it('renders', () => {
    const { container, unmount } = renderComponent(mockDelegateSet)
    expectSimpleRowText(
      container,
      'authorize',
      'rNRfqQc9b9ehXJJYVR6NqPPwrS26tWeB6N',
    )
    expectSimpleRowText(container, 'permissions', 'PaymentAccountDomainSet')

    unmount()
  })
})
