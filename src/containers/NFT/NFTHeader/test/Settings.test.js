import { mount } from 'enzyme'
import { I18nextProvider } from 'react-i18next'
import { Settings } from '../Settings'
import i18n from '../../../../i18nTestConfig'

describe('NFT Setttings container', () => {
  const flags = ['lsfBurnable', 'lsfOnlyXRP']

  const createWrapper = () =>
    mount(
      <I18nextProvider i18n={i18n}>
        <Settings flags={flags} />
      </I18nextProvider>,
    )

  it('renders without crashing', () => {
    const wrapper = createWrapper()
    wrapper.unmount()
  })

  it('renders defined fields', () => {
    const wrapper = createWrapper()
    expect(wrapper.find('.row').length).toEqual(3)
    expect((wrapper.text().match(/enabled/g) || []).length).toEqual(2)
    expect((wrapper.text().match(/disabled/g) || []).length).toEqual(1)
    wrapper.unmount()
  })
})
