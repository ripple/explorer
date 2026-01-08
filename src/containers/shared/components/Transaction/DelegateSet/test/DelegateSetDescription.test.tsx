import i18n from '../../../../../../i18n/testConfigEnglish'
import { createDescriptionWrapperFactory } from '../../test'
import { Description } from '../Description'
import mockDelegateSet from './mock_data/DelegateSet.json'

const createWrapper = createDescriptionWrapperFactory(Description, i18n)

describe('DelegateSet: Description', () => {
  it('renders', () => {
    const wrapper = createWrapper(mockDelegateSet)
    expect(wrapper).toHaveText(
      'rfFLs8ZknoJKHCw7MtJKcs8GL81dqoDGRz delegates Payment, AccountDomainSet permissions to rNRfqQc9b9ehXJJYVR6NqPPwrS26tWeB6N',
    )
    wrapper.unmount()
  })
})
