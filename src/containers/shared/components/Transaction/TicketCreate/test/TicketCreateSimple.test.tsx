import { createSimpleRenderFactory, expectSimpleRowText } from '../../test'
import { Simple } from '../Simple'
import TicketCreate from './mock_data/TicketCreate.json'

const createWrapper = createSimpleRenderFactory(Simple)

describe('TicketCreate: Simple', () => {
  it('renders ticket count', () => {
    const wrapper = createWrapper(TicketCreate)
    expectSimpleRowText(wrapper, 'ticket-count', '1')
    wrapper.unmount()
  })
})
