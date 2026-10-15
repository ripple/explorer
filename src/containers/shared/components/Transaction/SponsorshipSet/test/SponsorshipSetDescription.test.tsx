import i18n from '../../../../../../i18n/testConfigEnglish'
import { createDescriptionRenderFactory } from '../../test'
import { Description } from '../Description'
import SponsorshipSet from './mock_data/SponsorshipSet.json'
import SponsorshipSetDelete from './mock_data/SponsorshipSetDelete.json'
import SponsorshipSetDeleteBySponsee from './mock_data/SponsorshipSetDeleteBySponsee.json'

const renderComponent = createDescriptionRenderFactory(Description, i18n)

const SPONSOR = 'rFeeSponsorAlpha11111111111111111'
const SPONSEE = 'rncKvRcdDq9hVJpdLdTcKoxsS3NSkXsvfM'

describe('SponsorshipSet: Description', () => {
  it('describes fee and reserve sponsorship being set together', () => {
    const { container, unmount } = renderComponent(SponsorshipSet)
    expect(container).toHaveTextContent(
      `${SPONSOR} sponsors transaction fees and reserves for ${SPONSEE}`,
    )
    unmount()
  })

  it('describes only fee sponsorship being set', () => {
    const { container, unmount } = renderComponent({
      tx: {
        Account: SPONSOR,
        Sponsee: SPONSEE,
        FeeAmountDelta: '1000000',
      },
    })
    expect(container).toHaveTextContent(
      `${SPONSOR} sponsors transaction fees for ${SPONSEE}`,
    )
    unmount()
  })

  it('describes only reserve sponsorship being set', () => {
    const { container, unmount } = renderComponent({
      tx: {
        Account: SPONSOR,
        Sponsee: SPONSEE,
        RemainingOwnerCountDelta: 5,
      },
    })
    expect(container).toHaveTextContent(
      `${SPONSOR} sponsors reserves for ${SPONSEE}`,
    )
    unmount()
  })

  it('falls back to a generic description when neither delta is present', () => {
    const { container, unmount } = renderComponent({
      tx: {
        Account: SPONSOR,
        Sponsee: SPONSEE,
        MaxFee: '1000',
      },
    })
    expect(container).toHaveTextContent(
      `${SPONSOR} updates its sponsorship terms for ${SPONSEE}`,
    )
    unmount()
  })

  it('describes a sponsorship being ended by the sponsor', () => {
    const { container, unmount } = renderComponent(SponsorshipSetDelete)
    expect(container).toHaveTextContent(
      `${SPONSOR} ends its sponsorship of ${SPONSEE}`,
    )
    unmount()
  })

  it('describes a sponsorship being ended by the sponsee', () => {
    // CounterpartySponsor means the sponsee submitted this, not the sponsor.
    const { container, unmount } = renderComponent(
      SponsorshipSetDeleteBySponsee,
    )
    expect(container).toHaveTextContent(
      `${SPONSEE} ends the sponsorship from ${SPONSOR}`,
    )
    unmount()
  })

  it('describes a reduction when both deltas are negative', () => {
    const { container, unmount } = renderComponent({
      tx: {
        Account: SPONSOR,
        Sponsee: SPONSEE,
        FeeAmountDelta: '-1000000',
        RemainingOwnerCountDelta: -5,
      },
    })
    expect(container).toHaveTextContent(
      `${SPONSOR} reduces transaction fee and reserve sponsorship for ${SPONSEE}`,
    )
    unmount()
  })

  it('describes a fee-only reduction', () => {
    const { container, unmount } = renderComponent({
      tx: {
        Account: SPONSOR,
        Sponsee: SPONSEE,
        FeeAmountDelta: '-1000000',
      },
    })
    expect(container).toHaveTextContent(
      `${SPONSOR} reduces the transaction fee sponsorship for ${SPONSEE}`,
    )
    unmount()
  })

  it('describes a reserve-only reduction', () => {
    const { container, unmount } = renderComponent({
      tx: {
        Account: SPONSOR,
        Sponsee: SPONSEE,
        RemainingOwnerCountDelta: -5,
      },
    })
    expect(container).toHaveTextContent(
      `${SPONSOR} reduces the reserve sponsorship for ${SPONSEE}`,
    )
    unmount()
  })

  it('falls back to a generic description when the deltas have mixed signs', () => {
    const { container, unmount } = renderComponent({
      tx: {
        Account: SPONSOR,
        Sponsee: SPONSEE,
        FeeAmountDelta: '1000000',
        RemainingOwnerCountDelta: -5,
      },
    })
    expect(container).toHaveTextContent(
      `${SPONSOR} updates its sponsorship terms for ${SPONSEE}`,
    )
    unmount()
  })
})
