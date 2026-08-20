import { createTableDetailRenderFactory } from '../../test'
import { TableDetail } from '../TableDetail'
import i18n from '../../../../../../i18n/testConfigEnglish'
import SponsorshipSet from './mock_data/SponsorshipSet.json'
import SponsorshipSetDelete from './mock_data/SponsorshipSetDelete.json'

const renderComponent = createTableDetailRenderFactory(TableDetail, i18n)

describe('SponsorshipSetTableDetail', () => {
  it('renders fee sponsorship details', () => {
    const { container, unmount } = renderComponent(SponsorshipSet)

    expect(container.querySelectorAll('.account')[0]).toHaveTextContent(
      'rFeeSponsorAlpha11111111111111111',
    )
    expect(container.querySelectorAll('.account')[1]).toHaveTextContent(
      'rncKvRcdDq9hVJpdLdTcKoxsS3NSkXsvfM',
    )
    expect(
      container.querySelectorAll('[data-testid="amount"]')[0],
    ).toHaveTextContent('1.00 XRP')
    expect(
      container.querySelectorAll('[data-testid="amount"]')[1],
    ).toHaveTextContent('0.001 XRP')
    expect(container.querySelector('.sponsorship-set')).toHaveTextContent(
      'Reserve Count5',
    )

    unmount()
  })

  it('renders deletion state', () => {
    const { container, unmount } = renderComponent(SponsorshipSetDelete)

    expect(
      container.querySelector('[data-testid="sponsorship-deleted"]'),
    ).toHaveTextContent('Sponsorship Deleted')
    expect(container.querySelector('.sponsorship-set')).not.toHaveTextContent(
      'Fee Amount',
    )

    unmount()
  })
})
