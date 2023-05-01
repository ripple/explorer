import { mount } from 'enzyme'
import { I18nextProvider } from 'react-i18next'
import { describe, it, expect } from 'vitest'
import i18n from '../../../i18n/testConfig'
import Footer from '../index'

describe('Footer component', () => {
  const createWrapper = () =>
    mount(
      <I18nextProvider i18n={i18n}>
        <Footer />
      </I18nextProvider>,
    )

  it('renders without crashing', () => {
    const wrapper = createWrapper()
    wrapper.unmount()
  })

  it('renders all parts', () => {
    const wrapper = createWrapper()
    expect(wrapper.find('.logo').length).toEqual(1)
    expect(wrapper.find('.copyright').length).toEqual(1)
    expect(wrapper.find('.footer-link').length).toEqual(11)
    expect(wrapper.find('.footer-section-header').length).toEqual(3)

    wrapper.unmount()
  })
})
