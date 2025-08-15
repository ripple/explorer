import i18n from '../../../../../../i18n/testConfigEnglish'
import { createDescriptionWrapperFactory } from '../../test'
import { Description } from '../Description'
import mockVaultCreate from './mock_data/VaultCreate.json'

const createWrapper = createDescriptionWrapperFactory(Description, i18n)

describe('VaultCreate: Description', () => {
  it('renders', () => {
    const wrapper = createWrapper(mockVaultCreate)
    expect(wrapper).toHaveText(
      'rpZtrvuiVDhtSDZPm7axXgNB7iW3J4avwQ created a vault for USD.rJCPrRU8kcLfqCKob1j9EivLa4wG5pF4C2',
    )
    wrapper.unmount()
  })
})
