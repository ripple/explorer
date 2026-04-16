import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { I18nextProvider } from 'react-i18next'
import i18n from '../../../i18n/testConfig'
import { AMMPoolHeader } from '../AMMPoolHeader'
import { FormattedBalance } from '../types'

const renderComponent = (
  asset1: FormattedBalance | null = null,
  asset2: FormattedBalance | null = null,
) =>
  render(
    <I18nextProvider i18n={i18n}>
      <MemoryRouter>
        <AMMPoolHeader asset1={asset1} asset2={asset2} />
      </MemoryRouter>
    </I18nextProvider>,
  )

describe('AMMPoolHeader', () => {
  const asset1 = {
    currency: '524C555344000000000000000000000000000000',
    issuer: 'rMxCKbEDwqr76QuheSUMdEGf4B9xJ8m5De',
    amount: 1000,
  }
  const asset2 = { currency: 'XRP', amount: 5000 }

  it('renders AMM Pool title', () => {
    renderComponent()
    expect(screen.getByText('amm_pool')).toBeInTheDocument()
  })

  it('renders token pair badge with Currency components', () => {
    const { container } = renderComponent(asset1, asset2)

    expect(container.querySelector('.amm-pool-token-badge')).toBeInTheDocument()
    expect(container.querySelector('.badge-separator')).toBeInTheDocument()
  })

  it('does not render badge when assets are null', () => {
    const { container } = renderComponent()
    expect(
      container.querySelector('.amm-pool-token-badge'),
    ).not.toBeInTheDocument()
  })

  it('renders clickable link for non-XRP assets', () => {
    const { container } = renderComponent(asset1, asset2)

    const links = container.querySelectorAll('.amm-pool-token-badge a')
    expect(links.length).toBeGreaterThan(0)
  })
})
