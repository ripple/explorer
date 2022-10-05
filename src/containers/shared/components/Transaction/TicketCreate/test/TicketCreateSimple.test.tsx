import { createSimpleWrapperFactory } from '../../test'
import { Simple } from '../Simple'
import TicketCreate from './mock_data/TicketCreate.json'

const createWrapper = createSimpleWrapperFactory(Simple)

describe('TicketCreate: Simple', () => {
  it('renders', () => {
    const wrapper = createWrapper(TicketCreate)
    wrapper.unmount()
  })
  it('renders ticket count', () => {
    const wrapper = createWrapper(TicketCreate)
    const ticketCount = wrapper.find('.ticket-count')
    expect(ticketCount.length).toBe(1)
    wrapper.unmount()
  })
})
