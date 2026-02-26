import { render, screen } from '@testing-library/react'
import { I18nextProvider } from 'react-i18next'
import { TxLabel } from '../TxLabel'
import i18n from '../../../../i18n/testConfigEnglish'

describe('TxLabel', () => {
  const renderTxLabel = (type: string) =>
    render(
      <I18nextProvider i18n={i18n}>
        <TxLabel type={type} />
      </I18nextProvider>,
    )

  it('renders with an action specified ', () => {
    const { container, unmount } = renderTxLabel('Payment')
    expect(container.querySelector('.tx-category-PAYMENT')).toBeInTheDocument()
    expect(container.querySelector('svg')).toBeInTheDocument()
    expect(screen.getByText('Payment')).toBeInTheDocument()
    unmount()

    const { container: container2 } = renderTxLabel('OfferCancel')
    expect(container2.querySelector('.tx-category-DEX')).toBeInTheDocument()
    expect(container2.querySelector('svg')).toBeInTheDocument()
    expect(screen.getByText('Offer Cancel')).toBeInTheDocument()
  })

  it('renders with type that is not defined', () => {
    const { container } = renderTxLabel('WooCreate')
    expect(container.querySelector('.tx-category-OTHER')).toBeInTheDocument()
    expect(container.querySelector('svg')).toBeInTheDocument()
    expect(screen.getByText('WooCreate')).toBeInTheDocument()
  })
})
