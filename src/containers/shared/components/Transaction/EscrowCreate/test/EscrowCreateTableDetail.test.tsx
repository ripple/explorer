import { cleanup, screen } from '@testing-library/react'
import { createTableDetailRenderFactory } from '../../test'
import { TableDetail } from '../TableDetail'
import mockEscrowCreate from './mock_data/EscrowCreate.json'

const renderComponent = createTableDetailRenderFactory(TableDetail)

describe('EscrowCreateTableDetail', () => {
  afterEach(cleanup)
  it('renders EscrowCreate without crashing', () => {
    renderComponent(mockEscrowCreate)
    expect(screen.getByTestId('account')).toHaveTextContent(
      `rLbgNAngLq3HABBXK4uPGCHrqeZwgaYi7q`,
    )
    expect(screen.getByTestId('amount')).toHaveTextContent(`997.50 XRP`)
    expect(screen.getByTestId('condition')).toHaveTextContent(
      `A0258020886F982742772F414243855DC13B348FC78FB3D5119412C8A6480114E36A4451810120`,
    )
    expect(screen.getByTestId('finish_after')).toHaveTextContent(
      `March 1, 2020 at 9:01:00 AM UTC`,
    )
    expect(screen.getByTestId('cancel_after')).toHaveTextContent(
      `March 1, 2020 at 8:54:20 AM UTC`,
    )
  })
})
