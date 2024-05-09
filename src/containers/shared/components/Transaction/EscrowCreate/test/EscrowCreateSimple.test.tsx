import { Simple } from '../Simple'
import mockEscrowCreate from './mock_data/EscrowCreate.json'
import { createSimpleRenderFactory } from '../../test/createRenderFactory'
import { cleanup, screen } from '@testing-library/react'

const renderComponent = createSimpleRenderFactory(Simple)

describe('EscrowCreateSimple', () => {
  it('renders with an expiration and offer', () => {
    renderComponent(mockEscrowCreate)
    expect(wrapper.find('[data-testid="escrow-amount"] .value')).toHaveText(
      `\uE900997.50 XRP`,
    )
    expect(
      wrapper.find('[data-testid="escrow-destination"] .value'),
    ).toHaveText(`rLbgNAngLq3HABBXK4uPGCHrqeZwgaYi7q`)
    expect(wrapper.find('[data-testid="escrow-condition"] .value')).toHaveText(
      `A0258020886F982742772F414243855DC13B348FC78FB3D5119412C8A6480114E36A4451810120`,
    )
  })
})
