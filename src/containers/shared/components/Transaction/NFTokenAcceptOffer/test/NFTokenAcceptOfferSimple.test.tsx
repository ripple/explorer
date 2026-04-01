import { createSimpleRenderFactory } from '../../test/createWrapperFactory'
import { Simple } from '../Simple'
import transactionBuy from './mock_data/NFTokenAcceptOffer_Buy.json'
import transactionSell from './mock_data/NFTokenAcceptOffer_Sell.json'
import transactionFailure from './mock_data/NFTokenAcceptOffer_Failure.json'
import transactionBroker from './mock_data/NFTokenAcceptOffer_Broker.json'
import { expectSimpleRowText, expectSimpleRowNotToExist } from '../../test'

const renderComponent = createSimpleRenderFactory(Simple)

describe('NFTokenAcceptOffer', () => {
  it('handles NFTokenAcceptOffer Buy simple view ', () => {
    const { container, unmount } = renderComponent(transactionBuy)

    expectSimpleRowText(
      container,
      'token-id',
      '000800006203F49C21D5D6E022CB16DE3538F248662FC73C29ABA6A90000000D',
    )
    expectSimpleRowText(
      container,
      'offer-id',
      '8278760A246D4464EE701D503091B9DB0D9790DD2BBE9CAABCA45B04A1A25B6B',
    )
    expectSimpleRowText(container, 'amount', '\uE9000.0001 XRP')
    expectSimpleRowText(
      container,
      'buyer',
      'rfFRmXUR1yfxeUfXj7WwKhETrtToYx1hYh',
    )
    expectSimpleRowText(
      container,
      'seller',
      'r9AExd6v3keXaXa3nXAMHHcP9nWy9Aef2g',
    )
    unmount()
  })

  it('handles NFTokenAcceptOffer Sell simple view ', () => {
    const { container, unmount } = renderComponent(transactionSell)
    expectSimpleRowText(
      container,
      'token-id',
      '000800006203F49C21D5D6E022CB16DE3538F248662FC73C216B9CBF00000023',
    )
    expectSimpleRowText(
      container,
      'offer-id',
      '505E7F1E1EA989C0B0196AB7F503ACACAC7A9640C27B58A5E3C9DD31E88848D4',
    )
    expectSimpleRowText(container, 'amount', '\uE9000.000102 XRP')
    expectSimpleRowText(
      container,
      'buyer',
      'rfFRmXUR1yfxeUfXj7WwKhETrtToYx1hYh',
    )
    expectSimpleRowText(
      container,
      'seller',
      'r9AExd6v3keXaXa3nXAMHHcP9nWy9Aef2g',
    )
    unmount()
  })

  it('handles NFTokenAcceptOffer Sell Failure simple view ', () => {
    const { container, unmount } = renderComponent(transactionFailure)

    expectSimpleRowText(
      container,
      'offer-id',
      '17AFFE8C8D94554EB3A31A517B05C16085777FAEA9ACEDDCDE9D7CFD7B988D01',
    )
    expectSimpleRowNotToExist(container, 'token-id')
    expectSimpleRowNotToExist(container, 'amount')
    expectSimpleRowNotToExist(container, 'buyer')
    expectSimpleRowNotToExist(container, 'seller')
    unmount()
  })

  it('handles NFTokenAcceptOffer from Broker simple view ', () => {
    const { container, unmount } = renderComponent(transactionBroker)
    expectSimpleRowText(
      container,
      'token-id',
      '00081B581189F5687DBB7516339D6CCB5593D96622AD82DF08CFDA8600000A17',
    )
    expect(
      container.querySelectorAll('[data-testid="offer-id"] .value'),
    ).toHaveLength(2)
    expectSimpleRowText(container, 'amount', '\uE9002,500.00 XRP')
    expectSimpleRowText(
      container,
      'buyer',
      'rNYKGnHrjSnKXQGgACciyCLg4xRcwWZixN',
    )
    expectSimpleRowText(
      container,
      'seller',
      'rnp9DA6H2tLH7YFkgpjoVREB2yccYv56Sg',
    )
    unmount()
  })
})
