import { cleanup, screen } from '@testing-library/react'
import { createSimpleRenderFactory, expectSimpleRowText } from '../../test'
import { Simple } from '../Simple'
import TicketCreate from './mock_data/TicketCreate.json'

const renderComponent = createSimpleRenderFactory(Simple)

describe('TicketCreate: Simple', () => {
  afterEach(cleanup)
  it('renders ticket count', () => {
    renderComponent(TicketCreate)
    expectSimpleRowText(screen, 'ticket-count', '1')
  })
})
