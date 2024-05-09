import { render, cleanup, screen } from '@testing-library/react'
import { I18nextProvider } from 'react-i18next'
import i18n from '../../../i18n/testConfig'
import Footer from '../index'

describe('Footer component', () => {
  afterEach(cleanup)

  const renderComponent = () =>
    render(
      <I18nextProvider i18n={i18n}>
        <Footer />
      </I18nextProvider>,
    )

  it('renders without crashing', () => {
    renderComponent()
  })

  it('renders all parts', () => {
    renderComponent()
    expect(screen.queryAllByTitle('logo')).toHaveLength(1)
    expect(screen.queryAllByTitle('copyright')).toHaveLength(1)
    expect(screen.getAllByRole('link')).toHaveLength(13)
    expect(
      screen
        .getAllByRole('link')
        .filter((element) => element.className.includes('footer-link')),
    ).toHaveLength(12)
    expect(screen.queryByText('Learn')).toBeDefined()
    expect(screen.queryByText('Build')).toBeDefined()
    expect(screen.queryByText('Contribute')).toBeDefined()
  })
})
