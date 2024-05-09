import { cleanup, screen } from '@testing-library/react'
import { createSimpleRenderFactory } from '../../test/createRenderFactory'
import { Simple } from '../Simple'
import transactionBuy from './mock_data/NFTokenAcceptOffer_Buy.json'
import transactionSell from './mock_data/NFTokenAcceptOffer_Sell.json'
import transactionFailure from './mock_data/NFTokenAcceptOffer_Failure.json'
import transactionBroker from './mock_data/NFTokenAcceptOffer_Broker.json'
import { expectSimpleRowText, expectSimpleRowNotToExist } from '../../test'

const renderComponent = createSimpleRenderFactory(Simple)

describe('NFTokenAcceptOffer', () => {
  it('handles NFTokenAcceptOffer Buy simple view ', () => {
    renderComponent(transactionBuy)

    expectSimpleRowText(
      screen,
      'token-id',
      '000800006203F49C21D5D6E022CB16DE3538F248662FC73C29ABA6A90000000D',
    )
    expectSimpleRowText(
      screen,
      'offer-id',
      '8278760A246D4464EE701D503091B9DB0D9790DD2BBE9CAABCA45B04A1A25B6B',
    )
    expectSimpleRowText(screen, 'amount', '\uE9000.0001 XRP')
    expectSimpleRowText(screen, 'buyer', 'rfFRmXUR1yfxeUfXj7WwKhETrtToYx1hYh')
    expectSimpleRowText(screen, 'seller', 'r9AExd6v3keXaXa3nXAMHHcP9nWy9Aef2g')
  })

  it('handles NFTokenAcceptOffer Sell simple view ', () => {
    renderComponent(transactionSell)
    expectSimpleRowText(
      screen,
      'token-id',
      '000800006203F49C21D5D6E022CB16DE3538F248662FC73C216B9CBF00000023',
    )
    expectSimpleRowText(
      screen,
      'offer-id',
      '505E7F1E1EA989C0B0196AB7F503ACACAC7A9640C27B58A5E3C9DD31E88848D4',
    )
    expectSimpleRowText(screen, 'amount', '\uE9000.000102 XRP')
    expectSimpleRowText(screen, 'buyer', 'rfFRmXUR1yfxeUfXj7WwKhETrtToYx1hYh')
    expectSimpleRowText(screen, 'seller', 'r9AExd6v3keXaXa3nXAMHHcP9nWy9Aef2g')
  })

  it('handles NFTokenAcceptOffer Sell Failure simple view ', () => {
    renderComponent(transactionFailure)

    expectSimpleRowText(
      screen,
      'offer-id',
      '17AFFE8C8D94554EB3A31A517B05C16085777FAEA9ACEDDCDE9D7CFD7B988D01',
    )
    expectSimpleRowNotToExist(screen, 'token-id')
    expectSimpleRowNotToExist(screen, 'amount')
    expectSimpleRowNotToExist(screen, 'buyer')
    expectSimpleRowNotToExist(screen, 'seller')
  })

  it('handles NFTokenAcceptOffer from Broker simple view ', () => {
    renderComponent(transactionBroker)
    expectSimpleRowText(
      screen,
      'token-id',
      '00081B581189F5687DBB7516339D6CCB5593D96622AD82DF08CFDA8600000A17',
    )
    expect(screen.find('[data-testid="offer-id"] .value').length).toBe(2)
    expectSimpleRowText(screen, 'amount', '\uE9002,500.00 XRP')
    expectSimpleRowText(screen, 'buyer', 'rNYKGnHrjSnKXQGgACciyCLg4xRcwWZixN')
    expectSimpleRowText(screen, 'seller', 'rnp9DA6H2tLH7YFkgpjoVREB2yccYv56Sg')
  })
})
