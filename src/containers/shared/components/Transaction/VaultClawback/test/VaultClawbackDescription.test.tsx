import i18n from '../../../../../../i18n/testConfigEnglish'
import { createDescriptionRenderFactory } from '../../test'
import { Description } from '../Description'
import mockVaultCreate from './mock_data/VaultClawback.json'

const renderComponent = createDescriptionRenderFactory(Description, i18n)

describe('VaultClawback: Description', () => {
  it('renders', () => {
    const { container, unmount } = renderComponent(mockVaultCreate)
    expect(container).toHaveTextContent(
      'rhPempKXKgtkfbxMR1nZdb5SG8T35vYsZJ clawbacks $5.00 USD.rhPempKXKgtkfbxMR1nZdb5SG8T35vYsZJ from raMUwNw4u59UU9WWpqZYYEj77y8yZhC6Wp',
    )
    unmount()
  })
})
