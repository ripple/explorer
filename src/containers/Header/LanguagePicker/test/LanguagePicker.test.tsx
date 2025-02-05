import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import i18next from 'i18next'
import { I18nextProvider } from 'react-i18next'
import { LanguagePicker } from '../LanguagePicker'
import testConfigEnglish from '../../../../i18n/testConfigEnglish'

describe('LanguagePicker component', () => {
  afterEach(cleanup)
  it('should switch language', () => {
    render(
      <I18nextProvider i18n={testConfigEnglish}>
        <LanguagePicker />
      </I18nextProvider>,
    )

    // TODO: replace with userEvent
    fireEvent.click(screen.getByRole('button'))
    fireEvent.click(screen.getByText('日本語'))

    expect(i18next.language).toEqual('ja-JP')
  })
})
