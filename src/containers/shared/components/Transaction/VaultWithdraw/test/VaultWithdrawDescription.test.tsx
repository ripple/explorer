import i18n from '../../../../../../i18n/testConfigEnglish'
import { createDescriptionWrapperFactory } from '../../test'
import { Description } from '../Description'
import mockVaultCreate from './mock_data/VaultWithdraw.json'

const createWrapper = createDescriptionWrapperFactory(Description, i18n)

describe('VaultWithdraw: Description', () => {
  it('renders', () => {
    const wrapper = createWrapper(mockVaultCreate)
    expect(wrapper).toHaveText(
      'rQEzyNVohiNuWwYFnwUMEWeyK3KvACUbyB withdraws $5.00 USD.rMab3itPzruo5HLEVherc93Prf4tg5d7dx from Vault ID FCC4FB21E6F5B3E60661730C7F6F13A100E1E89FF4CF854D9A9B2F3DF967FD77',
    )
    wrapper.unmount()
  })
})
