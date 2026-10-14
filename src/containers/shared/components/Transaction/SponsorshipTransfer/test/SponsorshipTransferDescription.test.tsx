import i18n from '../../../../../../i18n/testConfigEnglish'
import { createDescriptionRenderFactory } from '../../test'
import { Description } from '../Description'
import SponsorshipTransferCreate from './mock_data/SponsorshipTransferCreate.json'
import SponsorshipTransferCreateObject from './mock_data/SponsorshipTransferCreateObject.json'
import SponsorshipTransferReassign from './mock_data/SponsorshipTransferReassign.json'
import SponsorshipTransferEnd from './mock_data/SponsorshipTransferEnd.json'
import SponsorshipTransferEndObject from './mock_data/SponsorshipTransferEndObject.json'

const renderComponent = createDescriptionRenderFactory(Description, i18n)

describe('SponsorshipTransfer: Description', () => {
  it('describes a create operation', () => {
    const { container, unmount } = renderComponent(SponsorshipTransferCreate)
    expect(container).toHaveTextContent(
      'rncKvRcdDq9hVJpdLdTcKoxsS3NSkXsvfM assigns rBaseReserveSponsor1111111111111 as its reserve sponsor',
    )
    unmount()
  })

  it('describes a create operation scoped to one object', () => {
    const { container, unmount } = renderComponent(
      SponsorshipTransferCreateObject,
    )
    expect(container).toHaveTextContent(
      'rncKvRcdDq9hVJpdLdTcKoxsS3NSkXsvfM assigns rBaseReserveSponsor1111111111111 as the reserve sponsor for object 04F57D...F3403E',
    )
    unmount()
  })

  it('describes a reassign operation scoped to one object', () => {
    // This fixture carries an ObjectID, so the reassignment is for that
    // object's reserve, not the account's own reserve.
    const { container, unmount } = renderComponent(SponsorshipTransferReassign)
    expect(container).toHaveTextContent(
      'rncKvRcdDq9hVJpdLdTcKoxsS3NSkXsvfM reassigns reserve sponsorship for object 04F57D...F3403E to rBaseReserveSponsor2222222222222',
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

  it('describes a sponsor ending sponsorship of one object', () => {
    // Account here is the sponsor, not the sponsee, and there is no Sponsee
    // field, so this must not fall through to the account-level end_self
    // wording.
    const { container, unmount } = renderComponent(SponsorshipTransferEndObject)
    expect(container).toHaveTextContent(
      'rBaseReserveSponsor1111111111111 ends its reserve sponsorship of object 04F57D...F3403E',
    )
    unmount()
  })
})
