import i18n from '../../../../../../i18n/testConfigEnglish'
import { createTableDetailWrapperFactory } from '../../test'
import { TableDetail } from '../TableDetail'
import mockVaultDeposit from './mock_data/VaultDeposit.json'

const createWrapper = createTableDetailWrapperFactory(TableDetail, i18n)

describe('VaultDepositTableDetail', () => {
  it('render VaultDepositTableDetail', () => {
    const wrapper = createWrapper(mockVaultDeposit)
    expect(wrapper).toHaveText(
      'Send$10.00 USD.rLm1zd4jWxwkoUcvbkRevwt7WC3GffF8B9to Vault IDC70AAB4EB1823B744559AF64D495AD084AC4113C2CFA4F71EB8DD8BB811137C2',
    )
    wrapper.unmount()
  })
})
