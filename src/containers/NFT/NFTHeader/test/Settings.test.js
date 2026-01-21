import { render } from '@testing-library/react'
import { I18nextProvider } from 'react-i18next'
import { Settings } from '../Settings'
import i18n from '../../../../i18n/testConfig'

describe('NFT Setttings container', () => {
  const flags = ['lsfBurnable', 'lsfOnlyXRP']

  const renderSettings = () =>
    render(
      <I18nextProvider i18n={i18n}>
        <Settings flags={flags} />
      </I18nextProvider>,
    )

  it('renders without crashing', () => {
    renderSettings()
  })

  it('renders defined fields', () => {
    const { container } = renderSettings()
    expect(container.querySelectorAll('.row').length).toEqual(3)
    expect((container.textContent.match(/enabled/g) || []).length).toEqual(2)
    expect((container.textContent.match(/disabled/g) || []).length).toEqual(1)
  })
})
