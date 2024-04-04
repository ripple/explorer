import { createSimpleWrapperFactory, expectSimpleRowText } from '../../test'
import { Simple } from '../Simple'
import transaction from './mock_data/Clawback.json'
import transactionFailure from './mock_data/Clawback_Failure.json'
import transactionMPT from './mock_data/ClawbackMPT.json'
import transactionMPTFailure from './mock_data/ClawbackMPT_Failure.json'

const createWrapper = createSimpleWrapperFactory(Simple)

describe('Clawback', () => {
  it('handles Clawback simple view ', () => {
    const wrapper = createWrapper(transaction)
    expectSimpleRowText(wrapper, 'holder', 'rscBWQpyZEmQvupeB1quu7Ky8YX4f5CHDP')
    expectSimpleRowText(
      wrapper,
      'amount',
      '3,840.00 FOO.rDZ713igKfedN4hhY6SjQse4Mv3ZrBxnn9',
    )
    wrapper.unmount()
  })

  it('handles MPT Clawback simple view ', () => {
    const wrapper = createWrapper(transactionMPT)
    expectSimpleRowText(wrapper, 'holder', 'rJxiAVBX7B9PqHXb7VmitRZWbFb87wzeb7')
    expectSimpleRowText(
      wrapper,
      'amount',
      '200 00002C8389DF4D75362F45B32EA66F8CF250438A9AD0D555 (MPT)',
    )
    wrapper.unmount()
  })

  it('handles failed Clawback simple view ', () => {
    const wrapper = createWrapper(transactionFailure)
    expectSimpleRowText(wrapper, 'holder', 'rDZ713igKfedN4hhY6SjQse4Mv3ZrBxnn9')
    expectSimpleRowText(
      wrapper,
      'amount',
      '4,840.00 FOO.rscBWQpyZEmQvupeB1quu7Ky8YX4f5CHDP',
    )
    wrapper.unmount()
  })

  it('handles failed MPT Clawback simple view ', () => {
    const wrapper = createWrapper(transactionMPTFailure)
    expectSimpleRowText(wrapper, 'holder', 'rHEudzMb9QwaHgKCT8NREJUQ9wWs8GwpKV')
    expectSimpleRowText(
      wrapper,
      'amount',
      '1000 0000012F2CCA489EAB713F0F099281FE4A9BCC2703560564 (MPT)',
    )
    wrapper.unmount()
  })
})
