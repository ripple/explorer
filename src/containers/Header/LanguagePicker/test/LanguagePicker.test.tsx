import { mount } from 'enzyme'
import i18next from 'i18next'
import { I18nextProvider } from 'react-i18next'
import { LanguagePicker } from '../LanguagePicker'
import testConfigEnglish from '../../../../i18n/testConfigEnglish'

describe('LanguagePicker component', () => {
  it('should switch language', () => {
    const wrapper = mount(
      <I18nextProvider i18n={testConfigEnglish}>
        <LanguagePicker />
      </I18nextProvider>,
    )

    wrapper.find('.dropdown-toggle').simulate('click')
    wrapper.find('.dropdown-item.language-picker-ja-JP').simulate('click')

    expect(i18next.language).toEqual('ja-JP')

    wrapper.unmount()
  })
})
