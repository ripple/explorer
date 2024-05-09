import { cleanup, screen } from '@testing-library/react'
import { createTableDetailRenderFactory } from '../../test'
import { TableDetail } from '../TableDetail'
import mockEscrowFinish from './mock_data/EscrowFinish.json'

const renderComponent = createTableDetailRenderFactory(TableDetail)

describe('EscrowFinishTableDetail', () => {
  it('renders EscrowFinish without crashing', () => {
    renderComponent(mockEscrowFinish)
    expect(wrapper.find('[data-testid="escrow-account"]')).toHaveText(
      `finish_escrowr4UDXF4nL7Tgss8uQxn39cCocd8GnGyXS8 -28`,
    )
    expect(wrapper.find('[data-testid="escrow-amount"]')).toHaveText(
      `\uE9000.0154 XRP`,
    )
    expect(wrapper.find('[data-testid="escrow-fullfillment"]')).toHaveText(
      `fulfillment Fulfillment `,
    )
  })
})
