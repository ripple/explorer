import { cleanup, screen } from '@testing-library/react'
import { createTableDetailRenderFactory } from '../../test'
import { TableDetail } from '../TableDetail'
import mockEscrowFinish from './mock_data/EscrowFinish.json'

const renderComponent = createTableDetailRenderFactory(TableDetail)

describe('EscrowFinish - TableDetail', () => {
  afterEach(cleanup)
  it('renders EscrowFinish without crashing', () => {
    renderComponent(mockEscrowFinish)
    expect(screen.getByTestId('escrow-account')).toHaveTextContent(
      `finish_escrowr4UDXF4nL7Tgss8uQxn39cCocd8GnGyXS8 -28`,
    )
    expect(screen.getByTestId('escrow-amount')).toHaveTextContent(
      `\uE9000.0154 XRP`,
    )
    expect(screen.getByTestId('escrow-fulfillment')).toHaveTextContent(
      `fulfillment Fulfillment `,
    )
  })
})
