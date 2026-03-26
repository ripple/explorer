import i18n from '../../../../../../i18n/testConfigEnglish'
import { createDescriptionRenderFactory } from '../../test'
import { Description } from '../Description'
import mockVaultCreate from './mock_data/VaultDeposit.json'

const renderComponent = createDescriptionRenderFactory(Description, i18n)

describe('VaultDeposit: Description', () => {
  it('renders', () => {
    const { container, unmount } = renderComponent(mockVaultCreate)
    expect(container).toHaveTextContent(
      'rsuz1RpQHqLXnMqtPuP7qWFpccTKN651VK deposits $10.00 USD.rLm1zd4jWxwkoUcvbkRevwt7WC3GffF8B9 into Vault ID C70AAB4EB1823B744559AF64D495AD084AC4113C2CFA4F71EB8DD8BB811137C2',
    )
    unmount()
  })
})
