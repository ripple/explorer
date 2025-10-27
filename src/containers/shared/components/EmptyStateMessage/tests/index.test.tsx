import { mount } from 'enzyme'
import { EmptyStateMessage } from '../index'

describe('EmptyStateMessage', () => {
  it('renders correctly with message', () => {
    const testMessage = 'No data available'
    const wrapper = mount(<EmptyStateMessage message={testMessage} />)
    expect(wrapper.find('.empty-state-message').length).toEqual(1)
    expect(wrapper.find('.empty-state-icon').length).toEqual(1)
    expect(wrapper.find('.empty-state-text').text()).toEqual(testMessage)
    wrapper.unmount()
  })
})
