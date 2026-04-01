import { render, screen } from '@testing-library/react'
import { I18nextProvider } from 'react-i18next'
import { MemoryRouter } from 'react-router'
import i18n from '../../../../i18n/testConfigEnglish'
import { TxStatus } from '../TxStatus'

describe('TxStatus', () => {
  const renderTxStatus = (status: string, shorthand = false) =>
    render(
      <I18nextProvider i18n={i18n}>
        <MemoryRouter>
          <TxStatus status={status} shorthand={shorthand} />
        </MemoryRouter>
      </I18nextProvider>,
    )

  it('renders success correctly ', () => {
    const { container } = renderTxStatus('tesSUCCESS')
    expect(screen.getByText('Success')).toBeInTheDocument()
    expect(container.querySelector('svg.success')).toBeInTheDocument()
  })

  it('renders success correctly without message in shorthand mode', () => {
    const { container } = renderTxStatus('tesSUCCESS', true)
    expect(screen.queryByText('Success')).not.toBeInTheDocument()
    expect(container.querySelector('svg.success')).toBeInTheDocument()
  })

  it('renders failure correctly ', () => {
    const { container } = renderTxStatus('tecPATH_DRY')
    expect(screen.getByText('Fail')).toBeInTheDocument()
    expect(screen.getByText('tecPATH_DRY')).toBeInTheDocument()
    expect(container.querySelector('svg.fail')).toBeInTheDocument()
    expect(screen.getByRole('link')).toHaveAttribute(
      'href',
      'https://xrpl.org/tec-codes.html#tecPATH_DRY',
    )
  })

  it('renders failure correctly without message in shorthand mode ', () => {
    const { container } = renderTxStatus('tecPATH_DRY', true)
    expect(container.querySelector('.status-message')).not.toBeInTheDocument()
    expect(screen.getByText('tecPATH_DRY')).toBeInTheDocument()
    expect(container.querySelector('svg.fail')).toBeInTheDocument()
    expect(screen.queryByRole('link')).not.toBeInTheDocument() // Not a link in shorthand
  })
})
