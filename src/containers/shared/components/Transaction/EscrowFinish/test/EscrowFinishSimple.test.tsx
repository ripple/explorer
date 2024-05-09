import { cleanup, screen } from '@testing-library/react'
import { createSimpleRenderFactory } from '../../test/createRenderFactory'
import { Simple } from '../Simple'
import mockEscrowFinish from './mock_data/EscrowFinish.json'

const renderComponent = createSimpleRenderFactory(Simple)

describe('EscrowFinish - Simple', () => {
  afterEach(cleanup)
  it('renders with an expiration and offer', () => {
    renderComponent(mockEscrowFinish)
    expect(screen.getByTestId('escrow-amount')).toHaveTextContent(
      `\uE9000.0154 XRP`,
    )
    expect(screen.getByTestId('escrow-tx')).toHaveTextContent(
      `3E2E755FA75FF1020C39E2ECC407E9F1C0E49A7229EDD15FF93B9F869878F1CC`,
    )
  })
})
