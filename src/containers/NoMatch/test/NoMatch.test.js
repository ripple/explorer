import { mount } from 'enzyme'
import { I18nextProvider } from 'react-i18next'
import i18n from '../../../i18n/testConfig'
import NoMatch from '../index'

/* eslint-disable react/jsx-props-no-spreading */
describe('NoMatch container', () => {
  const createWrapper = (props = {}) =>
    mount(
      <I18nextProvider i18n={i18n}>
        <NoMatch {...props} />
      </I18nextProvider>,
    )

  it('renders without crashing', () => {
    const wrapper = createWrapper()
    wrapper.unmount()
  })

  it('renders default messages and parts', () => {
    const wrapper = createWrapper()
    expect(wrapper.find('.uh-oh').length).toBe(1)
    expect(wrapper.find('.uh-oh').text()).toBe('404_uh_oh')
    expect(wrapper.find('.title').length).toBe(1)
    expect(wrapper.find('.title').text()).toBe('404_default_title')
    expect(wrapper.find('.hint').length).toBe(1)
    expect(wrapper.find('.hint').text()).toBe('404_check_url')
    expect(wrapper.find('.warning').length).toBe(1)
    wrapper.unmount()
  })

  it('renders correct messages from props', () => {
    const params = {
      title: 'props_title',
      hints: ['props_hint_1', 'props_hint_2'],
    }
    const wrapper = createWrapper(params)
    expect(wrapper.find('.uh-oh').length).toBe(1)
    expect(wrapper.find('.uh-oh').text()).toBe('404_uh_oh')
    expect(wrapper.find('.title').length).toBe(1)
    expect(wrapper.find('.title').text()).toBe('props_title')
    expect(wrapper.find('.hint').length).toBe(2)
    expect(wrapper.find('.hint').first().text()).toBe('props_hint_1')
    expect(wrapper.find('.hint').last().text()).toBe('props_hint_2')
    expect(wrapper.find('.warning').length).toBe(1)
    wrapper.unmount()
  })
})
