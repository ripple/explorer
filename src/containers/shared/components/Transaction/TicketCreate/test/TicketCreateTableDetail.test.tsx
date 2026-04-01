import { createTableDetailRenderFactory } from '../../test'
import { TableDetail } from '../TableDetail'
import TicketCreate from './mock_data/TicketCreate.json'

const renderComponent = createTableDetailRenderFactory(TableDetail)

describe('TicketCreate: TableDetail', () => {
  it('renders', () => {
    const { container, unmount } = renderComponent(TicketCreate)
    expect(container).toHaveTextContent('ticket_count: 1')
    unmount()
  })
})
