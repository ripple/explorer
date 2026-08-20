import i18n from '../../../../../../i18n/testConfigEnglish'
import { createDescriptionRenderFactory } from '../../test'
import { Description } from '../Description'
import SponsorshipSet from './mock_data/SponsorshipSet.json'
import SponsorshipSetDelete from './mock_data/SponsorshipSetDelete.json'

const renderComponent = createDescriptionRenderFactory(Description, i18n)

describe('SponsorshipSet: Description', () => {
  it('describes a fee sponsorship being set', () => {
    const { container, unmount } = renderComponent(SponsorshipSet)
    expect(container).toHaveTextContent(
      'rFeeSponsorAlpha11111111111111111 sponsors transaction fees for rncKvRcdDq9hVJpdLdTcKoxsS3NSkXsvfM',
    )
    unmount()
  })

  it('describes a fee sponsorship being ended', () => {
    const { container, unmount } = renderComponent(SponsorshipSetDelete)
    expect(container).toHaveTextContent(
      'rFeeSponsorAlpha11111111111111111 ends the fee sponsorship for rncKvRcdDq9hVJpdLdTcKoxsS3NSkXsvfM',
    )
    unmount()
  })
})
