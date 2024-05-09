import { ReactElement } from 'react'
import { I18nextProvider } from 'react-i18next'
import { MemoryRouter } from 'react-router'
import { cleanup, render, screen } from '@testing-library/react'
import i18n from '../../../../i18n/testConfigEnglish'
import { TxStatus } from '../TxStatus'

describe('TxStatus', () => {
  afterEach(cleanup)
  const renderComponent = (component: ReactElement) =>
    render(
      <I18nextProvider i18n={i18n}>
        <MemoryRouter>{component}</MemoryRouter>
      </I18nextProvider>,
    )

  it('renders success correctly ', () => {
    const { container } = renderComponent(<TxStatus status="tesSUCCESS" />)
    expect(container).toHaveTextContent('Success')
    expect(screen.getByTitle('status')).toBeDefined()
    expect(screen.getByTitle('status')).toHaveClass('success')
  })

  it('renders success correctly without message in shorthand mode', () => {
    const { container } = renderComponent(
      <TxStatus status="tesSUCCESS" shorthand />,
    )
    expect(container).not.toHaveTextContent('Success')
    expect(screen.getByTitle('status')).toBeDefined()
    expect(screen.getByTitle('status')).toHaveClass('success')
  })

  it('renders failure correctly', () => {
    renderComponent(<TxStatus status="tecPATH_DRY" />)
    expect(screen.getByText('Fail')).toBeDefined()
    expect(screen.getByTitle('status')).toBeDefined()
    expect(screen.getByTitle('status')).toHaveClass('fail')
    screen.debug()
    expect(screen.getByTitle('Fail - tecPATH_DRY')).toHaveAttribute(
      'href',
      'https://xrpl.org/tec-codes.html#tecPATH_DRY',
    )
  })

  it('renders failure correctly without message in shorthand mode ', () => {
    renderComponent(<TxStatus status="tecPATH_DRY" shorthand />)
    expect(screen.queryByText('Fail')).toBeNull()
    expect(screen.getByTitle('status')).toBeDefined()
    expect(screen.getByTitle('status')).toHaveClass('fail')
    expect(screen.getByTitle('Fail')).not.toHaveAttribute('href') // Not a link in shorthand
  })
})
