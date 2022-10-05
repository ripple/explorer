import { createTableDetailWrapperFactory } from '../../test'
import { TableDetail } from '../TableDetail'
import TicketCreate from './mock_data/TicketCreate.json'

const createWrapper = createTableDetailWrapperFactory(TableDetail)

describe('TicketCreate: TableDetail', () => {
  it('renders', () => {
    const wrapper = createWrapper(TicketCreate)
    expect(wrapper).toHaveText('ticket_count: 1')
    wrapper.unmount()
  })
})
