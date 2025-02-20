import { createSimpleWrapperFactory, expectSimpleRowText } from '../../test'
import { Simple } from '../Simple'
import CredentialDelete from './mock_data/CredentialDelete.json'

const createWrapper = createSimpleWrapperFactory(Simple)

describe('CredentialDelete: Simple', () => {
  it('renders', () => {
    const wrapper = createWrapper(CredentialDelete)

    expectSimpleRowText(
      wrapper,
      'subject',
      'rwXChshgJHh6KwwXY8hN1iNAiuyzJkz7p6',
    )
    expectSimpleRowText(wrapper, 'credential-type', 'My test credential')

    wrapper.unmount()
  })
})
