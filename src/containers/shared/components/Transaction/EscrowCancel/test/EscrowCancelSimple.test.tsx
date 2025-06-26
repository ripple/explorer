import { cleanup, screen } from '@testing-library/react'
import { createSimpleRenderFactory } from '../../test/createRenderFactory'
import { Simple } from '../Simple'
import mockEscrowCancel from './mock_data/EscrowCancel.json'

const renderComponent = createSimpleRenderFactory(Simple)

describe('EscrowCancel - Simple', () => {
  afterEach(cleanup)
  it('renders with an expiration and offer', () => {
    renderComponent(mockEscrowCancel)
    expect(screen.getByTestId('escrow-amount')).toHaveTextContent(
      `\uE900135.79 XRP`,
    )
    expect(screen.getByTestId('escrow-cancel')).toHaveTextContent(
      'rpmqbo5FWoydTL2Ufh5YdtzmRjbeLyxt56 - 9',
    )
    expect(screen.getByTestId('escrow-cancel-tx')).toHaveTextContent(
      `A979AD5C6A6C844913DA51D71BF5F0B8E254D9A211FA837C4B322C4A8FD358E6`,
    )
  })
})
