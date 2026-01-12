import { render, screen } from '@testing-library/react'
import { I18nextProvider } from 'react-i18next'
import { TxLabel } from '../TxLabel'
import TransactionCancelIcon from '../TransactionActionIcon/TransactionCancelIcon.svg'
import TransactionSendIcon from '../TransactionActionIcon/TransactionSendIcon.svg'
import TransactionUnknownIcon from '../TransactionActionIcon/TransactionUnknownIcon.svg'
import i18n from '../../../../i18n/testConfigEnglish'

describe('TxLabel', () => {
  const renderComponent = (component: any) =>
    render(<I18nextProvider i18n={i18n}>{component}</I18nextProvider>)

  it('renders with an action specified ', () => {
    renderComponent(<TxLabel type="Payment" />)
    expect(screen.getByTitle('tx-label')).toBeDefined()
    expect(screen.getByTitle('tx-label')).toHaveClass('tx-category-PAYMENT')
    expect(screen.getByTitle('tx-send')).toBeInTheDocument()
    expect(screen.getByTitle('tx-type-name')).toHaveTextContent('Payment')
  })

  it('renders with an action specified: OfferCancel', () => {
    renderComponent(<TxLabel type="OfferCancel" />)
    expect(screen.getByTitle('tx-label')).toBeDefined()
    expect(screen.getByTitle('tx-label')).toHaveClass('tx-category-DEX')
    expect(screen.getByTitle('tx-cancel')).toBeInTheDocument()
    expect(screen.getByTitle('tx-type-name')).toHaveTextContent('Offer Cancel')
  })

  it('renders with type that is not defined', () => {
    renderComponent(<TxLabel type="WooCreate" />)
    expect(screen.getByTitle('tx-label')).toBeDefined()
    expect(screen.getByTitle('tx-label')).toHaveClass('tx-category-OTHER')
    expect(screen.getByTitle('tx-unknown')).toBeInTheDocument()
    expect(screen.getByTitle('tx-type-name')).toHaveTextContent('WooCreate')
  })
})
