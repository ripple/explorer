import i18n from '../../../../../../i18n/testConfigEnglish'
import { createDescriptionRenderFactory } from '../../test'
import { Description } from '../Description'
import mockVaultCreate from './mock_data/VaultCreate.json'

const renderComponent = createDescriptionRenderFactory(Description, i18n)

describe('VaultCreate: Description', () => {
  it('renders', () => {
    const { container, unmount } = renderComponent(mockVaultCreate)
    expect(container).toHaveTextContent(
      'rpZtrvuiVDhtSDZPm7axXgNB7iW3J4avwQ created a vault for USD.rJCPrRU8kcLfqCKob1j9EivLa4wG5pF4C2',
    )
    unmount()
  })
})
