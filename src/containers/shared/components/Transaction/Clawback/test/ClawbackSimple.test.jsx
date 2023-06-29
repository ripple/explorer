import {
  createSimpleWrapperFactory,
  expectSimpleRowText,
  expectSimpleRowNotToExist,
} from '../../test'
import { Simple } from '../Simple'
import transaction from './mock_data/Clawback.json'

const createWrapper = createSimpleWrapperFactory(Simple)

describe('Clawback', () => {
  it('handles Clawback simple view ', () => {
    const wrapper = createWrapper(transaction)
    expectSimpleRowText(wrapper, 'issuer', 'rBUPvxccLNQJ3mKKK4JZgrJL6q5SBR674X')
    expectSimpleRowText(wrapper, 'holder', 'rn9N1bqXzKV6AwDXiS1mCjy27BGuwwweY6')
    expectSimpleRowText(
      wrapper,
      'amount',
      '3,840.00 FOO.rBUPvxccLNQJ3mKKK4JZgrJL6q5SBR674X',
    )
    wrapper.unmount()
  })
})
