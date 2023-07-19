import { mount } from 'enzyme'
import { I18nextProvider } from 'react-i18next'
import i18n from '../../../../i18n/testConfig'
import { Loader } from '../Loader'

describe('Loader', () => {
  it('renders correctly ', () => {
    const wrapper = mount(
      <I18nextProvider i18n={i18n}>
        <Loader />
      </I18nextProvider>,
    )
    expect(wrapper.find('.loader').length).toEqual(1)
    wrapper.unmount()
  })
})
