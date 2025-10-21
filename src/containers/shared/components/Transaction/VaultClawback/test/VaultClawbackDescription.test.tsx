import i18n from '../../../../../../i18n/testConfigEnglish'
import { createDescriptionWrapperFactory } from '../../test'
import { Description } from '../Description'
import mockVaultCreate from './mock_data/VaultClawback.json'

const createWrapper = createDescriptionWrapperFactory(Description, i18n)

describe('VaultClawback: Description', () => {
  it('renders', () => {
    const wrapper = createWrapper(mockVaultCreate)
    expect(wrapper).toHaveText(
      'rhPempKXKgtkfbxMR1nZdb5SG8T35vYsZJ clawbacks $5.00 USD.rhPempKXKgtkfbxMR1nZdb5SG8T35vYsZJ from raMUwNw4u59UU9WWpqZYYEj77y8yZhC6Wp',
    )
    wrapper.unmount()
  })
})
