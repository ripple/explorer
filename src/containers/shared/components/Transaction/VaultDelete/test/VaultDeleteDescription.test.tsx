import i18n from '../../../../../../i18n/testConfigEnglish'
import { createDescriptionWrapperFactory } from '../../test'
import { Description } from '../Description'
import mockVaultCreate from './mock_data/VaultDelete.json'

const createWrapper = createDescriptionWrapperFactory(Description, i18n)

describe('VaultDelete: Description', () => {
  it('renders', () => {
    const wrapper = createWrapper(mockVaultCreate)
    expect(wrapper).toHaveText(
      'rLR12AgChXxLoQsuLCizNCgh5pt5jPheo1 deleted a vault (2AA88C4CA646645E35E38B8D51CD2CA50BDE14A3F3FFE3838F2C8DCE95C2BABD)',
    )
    wrapper.unmount()
  })
})
