import { cleanup, screen } from '@testing-library/react'
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
    renderComponent(transaction)
    expectSimpleRowText(
      screen,
      'token-id',
      '000800006203F49C21D5D6E022CB16DE3538F248662FC73C29ABA6A90000000D',
    )
    expectSimpleRowNotToExist(screen, 'owner')
  })

  it('handles NFTokenBurn when the burner is not the owner', () => {
    renderComponent(transactionByIssuer)
    expectSimpleRowText(
      screen,
      'token-id',
      '00090000DF7682C6F61329B887798E2ABB518BF1C923F4010000099B00000000',
    )
    expectSimpleRowText(screen, 'owner', 'rH3Jr1zwADrokm2niuJLEAD5NuoVwBvzpk')
  })
})
