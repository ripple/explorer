import { createSimpleRenderFactory, expectSimpleRowText } from '../../test'
import { Simple } from '../Simple'
import i18n from '../../../../../../i18n/testConfigEnglish'
import SponsorshipSet from './mock_data/SponsorshipSet.json'
import SponsorshipSetDelete from './mock_data/SponsorshipSetDelete.json'

const renderComponent = createSimpleRenderFactory(Simple, i18n)

describe('SponsorshipSet: Simple', () => {
  it('renders fee sponsorship fields', () => {
    const { container, unmount } = renderComponent(SponsorshipSet)

    expectSimpleRowText(
      container,
      'sponsor',
      'rFeeSponsorAlpha11111111111111111',
    )
    expectSimpleRowText(
      container,
      'sponsee',
      'rncKvRcdDq9hVJpdLdTcKoxsS3NSkXsvfM',
    )
    expectSimpleRowText(container, 'fee-amount-delta', '1.00 XRP')
    expectSimpleRowText(container, 'max-fee', '0.001 XRP')
    expectSimpleRowText(container, 'reserve-count-delta', '+5')
    unmount()
  })

  it('renders deletion state without fee fields', () => {
    const { container, unmount } = renderComponent(SponsorshipSetDelete)

    expectSimpleRowText(container, 'sponsorship-deleted', 'Sponsorship Deleted')
    expect(
      container.querySelector('[data-testid="fee-amount-delta"]'),
    ).not.toBeInTheDocument()
    unmount()
  })
})
