import { createSimpleRenderFactory, expectSimpleRowText } from '../../test'
import { Simple } from '../Simple'
import i18n from '../../../../../../i18n/testConfigEnglish'
import SponsorshipTransferCreate from './mock_data/SponsorshipTransferCreate.json'
import SponsorshipTransferReassign from './mock_data/SponsorshipTransferReassign.json'
import SponsorshipTransferEnd from './mock_data/SponsorshipTransferEnd.json'

const renderComponent = createSimpleRenderFactory(Simple, i18n)

describe('SponsorshipTransfer: Simple', () => {
  it('renders a create operation', () => {
    const { container, unmount } = renderComponent(SponsorshipTransferCreate)

    expectSimpleRowText(container, 'operation', 'Create')
    expectSimpleRowText(
      container,
      'new-sponsor',
      'rBaseReserveSponsor1111111111111',
    )
    expect(
      container.querySelector('[data-testid="object-id"]'),
    ).not.toBeInTheDocument()
    unmount()
  })

  it('renders a reassign operation with an object id', () => {
    const { container, unmount } = renderComponent(SponsorshipTransferReassign)

    expectSimpleRowText(container, 'operation', 'Reassign')
    expectSimpleRowText(
      container,
      'object-id',
      '04F57D5C7F5B660C187BB55227DFC703AEFE482AEA8EEAF4C7FA5ED9BFF3403E',
    )
    expectSimpleRowText(
      container,
      'new-sponsor',
      'rBaseReserveSponsor2222222222222',
    )
    unmount()
  })

  it('renders an end operation with the sponsee', () => {
    const { container, unmount } = renderComponent(SponsorshipTransferEnd)

    expectSimpleRowText(container, 'operation', 'End')
    expectSimpleRowText(
      container,
      'sponsee',
      'rncKvRcdDq9hVJpdLdTcKoxsS3NSkXsvfM',
    )
    expect(
      container.querySelector('[data-testid="new-sponsor"]'),
    ).not.toBeInTheDocument()
    unmount()
  })
})
