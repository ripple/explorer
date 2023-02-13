import {
  createSimpleWrapperFactory,
  expectSimpleRowText,
  expectSimpleRowNotToExist,
} from '../../test'
import { Simple } from '../Simple'
import transaction from './mock_data/NFTokenBurn.json'
import transactionByIssuer from './mock_data/NFTokenBurnByIssuer.json'

const createWrapper = createSimpleWrapperFactory(Simple)

describe('NFTokenBurn', () => {
  it('handles NFTokenBurn simple view ', () => {
    const wrapper = createWrapper(transaction)
    expectSimpleRowText(
      wrapper,
      'token-id',
      '000800006203F49C21D5D6E022CB16DE3538F248662FC73C29ABA6A90000000D',
    )
    expectSimpleRowNotToExist(wrapper, 'owner')
    wrapper.unmount()
  })

  it('handles NFTokenBurn when the burner is not the owner', () => {
    const wrapper = createWrapper(transactionByIssuer)
    expectSimpleRowText(
      wrapper,
      'token-id',
      '00090000DF7682C6F61329B887798E2ABB518BF1C923F4010000099B00000000',
    )
    expectSimpleRowText(wrapper, 'owner', 'rH3Jr1zwADrokm2niuJLEAD5NuoVwBvzpk')
    wrapper.unmount()
  })
})
