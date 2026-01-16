import { createSimpleRenderFactory, expectSimpleRowText } from '../../test'
import { Simple } from '../Simple'
import TicketCreate from './mock_data/TicketCreate.json'

const renderComponent = createSimpleRenderFactory(Simple)

describe('TicketCreate: Simple', () => {
  it('renders ticket count', () => {
    const { container, unmount } = renderComponent(TicketCreate)
    expectSimpleRowText(container, 'ticket-count', '1')
    unmount()
  })
})
