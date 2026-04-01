import { render, fireEvent } from '@testing-library/react'
import i18next from 'i18next'
import { I18nextProvider } from 'react-i18next'
import { LanguagePicker } from '../LanguagePicker'
import testConfigEnglish from '../../../../i18n/testConfigEnglish'

describe('LanguagePicker component', () => {
  it('should switch language', () => {
    const { container } = render(
      <I18nextProvider i18n={testConfigEnglish}>
        <LanguagePicker />
      </I18nextProvider>,
    )

    fireEvent.click(container.querySelector('.dropdown-toggle')!)
    fireEvent.click(
      container.querySelector('.dropdown-item.language-picker-ja-JP')!,
    )

    expect(i18next.language).toEqual('ja-JP')
  })
})
