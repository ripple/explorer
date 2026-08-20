import i18n from '../../../../../../i18n/testConfigEnglish'
import { createDescriptionRenderFactory } from '../../test'
import { Description } from '../Description'
import SponsorshipTransferCreate from './mock_data/SponsorshipTransferCreate.json'
import SponsorshipTransferReassign from './mock_data/SponsorshipTransferReassign.json'
import SponsorshipTransferEnd from './mock_data/SponsorshipTransferEnd.json'

const renderComponent = createDescriptionRenderFactory(Description, i18n)

describe('SponsorshipTransfer: Description', () => {
  it('describes a create operation', () => {
    const { container, unmount } = renderComponent(SponsorshipTransferCreate)
    expect(container).toHaveTextContent(
      'rncKvRcdDq9hVJpdLdTcKoxsS3NSkXsvfM assigns rBaseReserveSponsor1111111111111 as its reserve sponsor',
    )
    unmount()
  })

  it('describes a reassign operation', () => {
    const { container, unmount } = renderComponent(SponsorshipTransferReassign)
    expect(container).toHaveTextContent(
      'rncKvRcdDq9hVJpdLdTcKoxsS3NSkXsvfM reassigns reserve sponsorship to rBaseReserveSponsor2222222222222',
    )
    unmount()
  })

  it('describes an end operation on behalf of a sponsee', () => {
    const { container, unmount } = renderComponent(SponsorshipTransferEnd)
    expect(container).toHaveTextContent(
      'rBaseReserveSponsor1111111111111 ends reserve sponsorship for rncKvRcdDq9hVJpdLdTcKoxsS3NSkXsvfM',
    )
    unmount()
  })
})
