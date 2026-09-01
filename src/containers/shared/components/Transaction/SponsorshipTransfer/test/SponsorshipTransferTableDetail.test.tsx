import { createTableDetailRenderFactory } from '../../test'
import { TableDetail } from '../TableDetail'
import i18n from '../../../../../../i18n/testConfigEnglish'
import SponsorshipTransferCreate from './mock_data/SponsorshipTransferCreate.json'
import SponsorshipTransferReassign from './mock_data/SponsorshipTransferReassign.json'

const renderComponent = createTableDetailRenderFactory(TableDetail, i18n)

describe('SponsorshipTransferTableDetail', () => {
  it('renders a create operation', () => {
    const { container, unmount } = renderComponent(SponsorshipTransferCreate)

    expect(
      container.querySelector('[data-testid="operation"]'),
    ).toHaveTextContent('Create')
    expect(container.querySelectorAll('.account')[0]).toHaveTextContent(
      'rBaseReserveSponsor1111111111111',
    )
    unmount()
  })

  it('renders a reassign operation with a shortened object id', () => {
    const { container, unmount } = renderComponent(SponsorshipTransferReassign)

    expect(
      container.querySelector('[data-testid="operation"]'),
    ).toHaveTextContent('Reassign')
    expect(
      container.querySelector('[data-testid="object-id"]'),
    ).toHaveTextContent('04F57D...F3403E')
    unmount()
  })
})
