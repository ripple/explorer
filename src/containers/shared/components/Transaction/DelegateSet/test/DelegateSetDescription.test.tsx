import i18n from '../../../../../../i18n/testConfigEnglish'
import { createDescriptionRenderFactory } from '../../test'
import { Description } from '../Description'
import mockDelegateSet from './mock_data/DelegateSet.json'

const renderComponent = createDescriptionRenderFactory(Description, i18n)

describe('DelegateSet: Description', () => {
  it('renders', () => {
    const { container, unmount } = renderComponent(mockDelegateSet)
    expect(container).toHaveTextContent(
      'rfFLs8ZknoJKHCw7MtJKcs8GL81dqoDGRz delegates Payment, AccountDomainSet permissions to rNRfqQc9b9ehXJJYVR6NqPPwrS26tWeB6N',
    )
    unmount()
  })
})
