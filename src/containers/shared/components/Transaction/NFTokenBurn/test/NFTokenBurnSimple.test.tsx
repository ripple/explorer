import {
  createSimpleRenderFactory,
  expectSimpleRowText,
  expectSimpleRowNotToExist,
} from '../../test'
import { Simple } from '../Simple'
import transaction from './mock_data/NFTokenBurn.json'
import transactionByIssuer from './mock_data/NFTokenBurnByIssuer.json'

const renderComponent = createSimpleRenderFactory(Simple)

describe('NFTokenBurn', () => {
  it('handles NFTokenBurn simple view ', () => {
    const { container, unmount } = renderComponent(transaction)
    expectSimpleRowText(
      container,
      'token-id',
      '000800006203F49C21D5D6E022CB16DE3538F248662FC73C29ABA6A90000000D',
    )
    expectSimpleRowNotToExist(container, 'owner')
    unmount()
  })

  it('handles NFTokenBurn when the burner is not the owner', () => {
    const { container, unmount } = renderComponent(transactionByIssuer)
    expectSimpleRowText(
      container,
      'token-id',
      '00090000DF7682C6F61329B887798E2ABB518BF1C923F4010000099B00000000',
    )
    expectSimpleRowText(container, 'owner', 'rH3Jr1zwADrokm2niuJLEAD5NuoVwBvzpk')
    unmount()
  })
})
