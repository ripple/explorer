import i18n from '../../../../../../i18n/testConfigEnglish'
import { createTableDetailWrapperFactory } from '../../test'
import { TableDetail } from '../TableDetail'
import mockVaultClawback from './mock_data/VaultClawback.json'

const createWrapper = createTableDetailWrapperFactory(TableDetail, i18n)

describe('VaultClawbackTableDetail', () => {
  it('render VaultClawbackTableDetail', () => {
    const wrapper = createWrapper(mockVaultClawback)
    expect(wrapper).toHaveText(
      'Claws back $5.00 USD.rhPempKXKgtkfbxMR1nZdb5SG8T35vYsZJ from raMUwNw4u59UU9WWpqZYYEj77y8yZhC6Wp',
    )
    wrapper.unmount()
  })
})
