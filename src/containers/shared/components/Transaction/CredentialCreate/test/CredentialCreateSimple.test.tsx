import { createSimpleWrapperFactory, expectSimpleRowText } from '../../test'
import { Simple } from '../Simple'
import CredentialCreate from './mock_data/CredentialCreate.json'

const createWrapper = createSimpleWrapperFactory(Simple)

describe('CredentialCreate: Simple', () => {
  it('renders', () => {
    const wrapper = createWrapper(CredentialCreate)
    expectSimpleRowText(
      wrapper,
      'subject',
      'rwXChshgJHh6KwwXY8hN1iNAiuyzJkz7p6',
    )
    expectSimpleRowText(wrapper, 'credential-type', 'My test credential')

    wrapper.unmount()
  })
})
