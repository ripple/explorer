import { cleanup, screen } from '@testing-library/react'
import EscrowCancel from './mock_data/EscrowCancel.json'
import { Description } from '../Description'
import { createDescriptionRenderFactory } from '../../test'

const renderComponent = createDescriptionRenderFactory(Description)

describe('EscrowCancelDescription', () => {
  it('renders description for EscrowCancel', () => {
    renderComponent(EscrowCancel)
    expect(screen.html()).toBe(
      '<div>escrow_cancellation_desc <a data-testid="account" title="rpmqbo5FWoydTL2Ufh5YdtzmRjbeLyxt56" class="account" href="/accounts/rpmqbo5FWoydTL2Ufh5YdtzmRjbeLyxt56">rpmqbo5FWoydTL2Ufh5YdtzmRjbeLyxt56</a></div><div>The escrowed amount of<b>\uE900135.79<small>XRP</small></b>was returned to<a data-testid="account" title="rpmqbo5FWoydTL2Ufh5YdtzmRjbeLyxt56" class="account" href="/accounts/rpmqbo5FWoydTL2Ufh5YdtzmRjbeLyxt56">rpmqbo5FWoydTL2Ufh5YdtzmRjbeLyxt56</a><span> (<b>\uE900135.78999<small>XRP</small></b> escrow_after_transaction_cost)</span></div>The escrow was created by<a data-testid="account" title="rpmqbo5FWoydTL2Ufh5YdtzmRjbeLyxt56" class="account" href="/accounts/rpmqbo5FWoydTL2Ufh5YdtzmRjbeLyxt56">rpmqbo5FWoydTL2Ufh5YdtzmRjbeLyxt56</a>with transaction<a class="hash" href="/transactions/A979AD5C6A6C844913DA51D71BF5F0B8E254D9A211FA837C4B322C4A8FD358E6">A979AD...</a>',
    )
  })
})
