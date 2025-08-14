import i18n from '../../../../../../i18n/testConfigEnglish'
import { createTableDetailWrapperFactory } from '../../test'
import { TableDetail } from '../TableDetail'
import mockVaultSet from './mock_data/VaultSet.json'

const createWrapper = createTableDetailWrapperFactory(TableDetail, i18n)

describe('VaultSetTableDetail', () => {
  it('render VaultSetTableDetail', () => {
    const wrapper = createWrapper(mockVaultSet)
    expect(wrapper).toHaveText(
      'Vault ID: 47148BAF6D14F8456F859A4DFCF2B2921512E44C5E1EADD72D34F33F6ED2AA00Data: 75706461746564206D65746164617461Assets Maximum: 1000',
    )
    wrapper.unmount()
  })
})
