import { cleanup, screen } from '@testing-library/react'
import { createTableDetailRenderFactory } from '../../test'
import { TableDetail } from '../TableDetail'
import TicketCreate from './mock_data/TicketCreate.json'

const renderComponent = createTableDetailRenderFactory(TableDetail)

describe('TicketCreate: TableDetail', () => {
  afterEach(cleanup)
  it('renders', () => {
    const { container } = renderComponent(TicketCreate)
    expect(container).toHaveTextContent('ticket_count: 1')
  })
})
