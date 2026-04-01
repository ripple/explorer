import { render } from '@testing-library/react'
import { I18nextProvider } from 'react-i18next'
import i18n from '../../../i18n/testConfig'
import Footer from '../index'

describe('Footer component', () => {
  const renderFooter = () =>
    render(
      <I18nextProvider i18n={i18n}>
        <Footer />
      </I18nextProvider>,
    )

  it('renders without crashing', () => {
    renderFooter()
  })

  it('renders all parts', () => {
    const { container } = renderFooter()
    expect(container.querySelectorAll('.logo')).toHaveLength(1)
    expect(container.querySelectorAll('.copyright')).toHaveLength(1)
    expect(container.querySelectorAll('.footer-link')).toHaveLength(12)
    expect(container.querySelectorAll('.footer-section-header')).toHaveLength(3)
  })
})
