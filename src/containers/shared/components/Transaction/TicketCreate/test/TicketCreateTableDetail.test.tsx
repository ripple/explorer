import { cleanup, screen } from '@testing-library/react'
import { createTableDetailRenderFactory } from '../../test'
import { TableDetail } from '../TableDetail'
import TicketCreate from './mock_data/TicketCreate.json'

const renderComponent = createTableDetailRenderFactory(TableDetail)

describe('TicketCreate: TableDetail', () => {
  afterEach(cleanup)
  it('renders', () => {
    renderComponent(TicketCreate)
    expect(wrapper).toHaveText('ticket_count: 1')
  })
})
