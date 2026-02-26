import i18n from '../../../../../../i18n/testConfigEnglish'
import { createDescriptionRenderFactory } from '../../test'
import { Description } from '../Description'
import mockVaultSet from './mock_data/VaultSet.json'

const renderComponent = createDescriptionRenderFactory(Description, i18n)

describe('VaultSet: Description', () => {
  it('renders', () => {
    const { container, unmount } = renderComponent(mockVaultSet)
    expect(container.querySelector('[data-testid="data"]')).toHaveTextContent(
      `It sets the Vault Data to 75706461746564206D65746164617461`,
    )
    expect(
      container.querySelector('[data-testid="assets_maximum"]'),
    ).toHaveTextContent(`It sets the Vault Assets Maximum to 1000`)
    expect(
      container.querySelector('[data-testid="domain_id"]'),
    ).not.toBeInTheDocument()
    unmount()
  })
})
