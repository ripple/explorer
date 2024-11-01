import { cleanup, render, screen } from '@testing-library/react'
import { I18nextProvider } from 'react-i18next'
import { TxLabel } from '../TxLabel'
import i18n from '../../../../i18n/testConfigEnglish'

describe('TxLabel', () => {
  afterEach(cleanup)
  const renderComponent = (component: any) =>
    render(<I18nextProvider i18n={i18n}>{component}</I18nextProvider>)

  it('renders with an action specified', () => {
    const { container } = renderComponent(<TxLabel type="Payment" />)

    expect(screen.getByTitle('tx-label')).toHaveClass('tx-category-PAYMENT')
    expect(screen.queryByTitle('tx-send')).toBeDefined()
    expect(container).toHaveTextContent('Payment')
  })

  it('renders with an action specified 2', () => {
    const { container } = renderComponent(<TxLabel type="OfferCancel" />)

    expect(screen.getByTitle('tx-label')).toHaveClass('tx-category-DEX')
    expect(screen.queryByTitle('tx-cancel')).toBeDefined()
    expect(container).toHaveTextContent('Offer Cancel')
  })

  it('renders with type that is not defined', () => {
    const { container } = renderComponent(<TxLabel type="WooCreate" />)

    expect(screen.getByTitle('tx-label')).toHaveClass('tx-category-UNKNOWN')
    expect(screen.queryByTitle('tx-unknown')).toBeDefined()
    expect(container).toHaveTextContent('WooCreate')
  })
})
