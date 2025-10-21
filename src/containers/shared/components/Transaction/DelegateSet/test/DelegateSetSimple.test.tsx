import { expectSimpleRowText, createSimpleWrapperFactory } from '../../test'
import { Simple } from '../Simple'
import mockDelegateSet from './mock_data/DelegateSet.json'

const createWrapper = createSimpleWrapperFactory(Simple)

describe('DelegateSet: Simple', () => {
  it('renders', () => {
    const wrapper = createWrapper(mockDelegateSet)
    expectSimpleRowText(
      wrapper,
      'authorize',
      'rNRfqQc9b9ehXJJYVR6NqPPwrS26tWeB6N',
    )
    expectSimpleRowText(wrapper, 'permissions', 'PaymentAccountDomainSet')

    wrapper.unmount()
  })
})
