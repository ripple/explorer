import i18n from '../../../../../../i18n/testConfigEnglish'
import { createTableDetailWrapperFactory } from '../../test'
import { TableDetail } from '../TableDetail'
import mockVaultCreate from './mock_data/VaultCreate.json'

const createWrapper = createTableDetailWrapperFactory(TableDetail, i18n)

describe('VaultCreateTableDetail', () => {
  it('render VaultCreateTableDetail', () => {
    const wrapper = createWrapper(mockVaultCreate)
    expect(wrapper).toHaveText(
      // "create vault" is displayed on the UI
      'Createvault for USD.rJCPrRU8kcLfqCKob1j9EivLa4wG5pF4C2',
    )
    wrapper.unmount()
  })
})
