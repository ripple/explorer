import { createTableDetailRenderFactory } from '../../test'
import { TableDetail } from '../TableDetail'
import TicketCreate from './mock_data/TicketCreate.json'

const createWrapper = createTableDetailRenderFactory(TableDetail)

describe('TicketCreate: TableDetail', () => {
  it('renders', () => {
    const wrapper = createWrapper(TicketCreate)
    expect(wrapper).toHaveText('ticket_count: 1')
    wrapper.unmount()
  })
})
