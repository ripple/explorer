import { createSimpleWrapperFactory } from '../../test/createWrapperFactory'
import { Simple } from '../Simple'
import transactionBuy from './mock_data/NFTokenAcceptOffer_Buy.json'
import transactionSell from './mock_data/NFTokenAcceptOffer_Sell.json'
import transactionFailure from './mock_data/NFTokenAcceptOffer_Failure.json'
import transactionBroker from './mock_data/NFTokenAcceptOffer_Broker.json'

const createWrapper = createSimpleWrapperFactory(Simple)

describe('NFTokenAcceptOffer', () => {
  it('handles NFTokenAcceptOffer Buy simple view ', () => {
    const wrapper = createWrapper(transactionBuy)

    expect(wrapper.find('[data-test="token-id"] .value')).toHaveText(
      '000800006203F49C21D5D6E022CB16DE3538F248662FC73C29ABA6A90000000D',
    )
    expect(wrapper.find('[data-test="offer-id"] .value')).toHaveText(
      '8278760A246D4464EE701D503091B9DB0D9790DD2BBE9CAABCA45B04A1A25B6B',
    )
    expect(wrapper.find('[data-test="amount"] .value')).toHaveText(
      '\uE9000.0001 XRP',
    )
    expect(wrapper.find('[data-test="buyer"] .value')).toHaveText(
      'rfFRmXUR1yfxeUfXj7WwKhETrtToYx1hYh',
    )
    expect(wrapper.find('[data-test="seller"] .value')).toHaveText(
      'r9AExd6v3keXaXa3nXAMHHcP9nWy9Aef2g',
    )
    wrapper.unmount()
  })

  it('handles NFTokenAcceptOffer Sell simple view ', () => {
    const wrapper = createWrapper(transactionSell)

    expect(wrapper.find('[data-test="token-id"] .value')).toHaveText(
      '000800006203F49C21D5D6E022CB16DE3538F248662FC73C216B9CBF00000023',
    )
    expect(wrapper.find('[data-test="offer-id"] .value')).toHaveText(
      '505E7F1E1EA989C0B0196AB7F503ACACAC7A9640C27B58A5E3C9DD31E88848D4',
    )
    expect(wrapper.find('[data-test="amount"] .value')).toHaveText(
      '\uE9000.000102 XRP',
    )
    expect(wrapper.find('[data-test="buyer"] .value')).toHaveText(
      'rfFRmXUR1yfxeUfXj7WwKhETrtToYx1hYh',
    )
    expect(wrapper.find('[data-test="seller"] .value')).toHaveText(
      'r9AExd6v3keXaXa3nXAMHHcP9nWy9Aef2g',
    )
    wrapper.unmount()
  })

  it('handles NFTokenAcceptOffer Sell Failure simple view ', () => {
    const wrapper = createWrapper(transactionFailure)

    expect(wrapper.find('[data-test="offer-id"] .value')).toHaveText(
      '17AFFE8C8D94554EB3A31A517B05C16085777FAEA9ACEDDCDE9D7CFD7B988D01',
    )
    expect(wrapper.find('[data-test="token-id"]')).not.toExist()
    expect(wrapper.find('[data-test="amount"]')).not.toExist()
    expect(wrapper.find('[data-test="buyer"]')).not.toExist()
    expect(wrapper.find('[data-test="seller"]')).not.toExist()
    wrapper.unmount()
  })

  it('handles NFTokenAcceptOffer from Broker simple view ', () => {
    const wrapper = createWrapper(transactionBroker)

    expect(wrapper.find('[data-test="token-id"] .value')).toHaveText(
      '00081B581189F5687DBB7516339D6CCB5593D96622AD82DF08CFDA8600000A17',
    )
    expect(wrapper.find('[data-test="offer-id"] .value').length).toBe(2)
    expect(wrapper.find('[data-test="amount"] .value')).toHaveText(
      '\uE9002,500.00 XRP',
    )
    expect(wrapper.find('[data-test="buyer"] .value')).toHaveText(
      'rNYKGnHrjSnKXQGgACciyCLg4xRcwWZixN',
    )
    expect(wrapper.find('[data-test="seller"] .value')).toHaveText(
      'rnp9DA6H2tLH7YFkgpjoVREB2yccYv56Sg',
    )
    wrapper.unmount()
  })
})
