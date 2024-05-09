import { cleanup, screen } from '@testing-library/react'
import { Simple } from '../Simple'
import mockEscrowCreate from './mock_data/EscrowCreate.json'
import { createSimpleRenderFactory } from '../../test/createRenderFactory'

const renderComponent = createSimpleRenderFactory(Simple)

describe('EscrowCreate - Simple', () => {
  afterEach(cleanup)
  it('renders with an expiration and offer', () => {
    renderComponent(mockEscrowCreate)
    expect(screen.getByTestId('escrow-amount')).toHaveTextContent(
      `\uE900997.50 XRP`,
    )
    expect(screen.getByTestId('escrow-destination')).toHaveTextContent(
      `rLbgNAngLq3HABBXK4uPGCHrqeZwgaYi7q`,
    )
    expect(screen.getByTestId('escrow-condition')).toHaveTextContent(
      `A0258020886F982742772F414243855DC13B348FC78FB3D5119412C8A6480114E36A4451810120`,
    )
  })
})
