import { expectSimpleRowText, createSimpleWrapperFactory } from '../../test'
import { Simple } from '../Simple'
import mockVaultDelete from './mock_data/VaultDelete.json'

const createWrapper = createSimpleWrapperFactory(Simple)

describe('VaultDelete: Simple', () => {
  it('renders', () => {
    const wrapper = createWrapper(mockVaultDelete)
    expectSimpleRowText(
      wrapper,
      'vault_id',
      '2AA88C4CA646645E35E38B8D51CD2CA50BDE14A3F3FFE3838F2C8DCE95C2BABD',
    )
    wrapper.unmount()
  })
})
