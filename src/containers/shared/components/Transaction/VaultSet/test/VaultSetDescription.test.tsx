import i18n from '../../../../../../i18n/testConfigEnglish'
import { createDescriptionWrapperFactory } from '../../test'
import { Description } from '../Description'
import mockVaultSet from './mock_data/VaultSet.json'

const createWrapper = createDescriptionWrapperFactory(Description, i18n)

describe('VaultSet: Description', () => {
  it('renders', () => {
    const wrapper = createWrapper(mockVaultSet)
    expect(wrapper.find('[data-testid="data"]')).toHaveText(
      `It sets the Vault Data to 75706461746564206D65746164617461`,
    )
    expect(wrapper.find('[data-testid="assets_maximum"]')).toHaveText(
      `It sets the Vault Assets Maximum to 0.001 XRP`,
    )
    expect(wrapper.find('[data-testid="domain_id"]')).toEqual({})
    wrapper.unmount()
  })
})
