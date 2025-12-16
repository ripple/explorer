import {
  createSimpleWrapperFactory,
  expectSimpleRowText,
  expectSimpleRowLabel,
} from '../../test'
import { Simple } from '../Simple'
import mockDepositPreauth from './mock_data/DepositPreauth.json'
import mockDepositPreauthUnauthorize from './mock_data/DepositPreauthUnauthorize.json'
import mockDepositPreauthAuthorizeCredentials from './mock_data/DepositPreauthAuthorizeCredentials.json'
import mockDepositPreauthUnauthorizeCredentials from './mock_data/DepositPreauthUnauthorizeCredentials.json'

const createWrapper = createSimpleWrapperFactory(Simple)

describe('DepositPreauth: Simple', () => {
  it('renders authorized', () => {
    const wrapper = createWrapper(mockDepositPreauth)
    expectSimpleRowText(
      wrapper,
      'authorize',
      'rDJFnv5sEfp42LMFiX3mVQKczpFTdxYDzM',
    )
    wrapper.unmount()
  })

  it('renders unauthorized', () => {
    const wrapper = createWrapper(mockDepositPreauthUnauthorize)
    expectSimpleRowText(
      wrapper,
      'unauthorize',
      'rDJFnv5sEfp42LMFiX3mVQKczpFTdxYDzM',
    )
    wrapper.unmount()
  })

  it('renders authorize credentials', () => {
    const wrapper = createWrapper(mockDepositPreauthAuthorizeCredentials)

    // Check that SimpleGroup is rendered
    expect(wrapper.find('.group')).toHaveLength(2)
    expect(wrapper.find('.group-title')).toHaveLength(1)

    // Check first credential
    expectSimpleRowText(wrapper, 'credential-issuer-0', 'rISABEL......')
    expectSimpleRowLabel(wrapper, 'credential-issuer-0', 'credential_issuer')
    expectSimpleRowText(wrapper, 'credential-type-0', 'KYC') // 4B5943 hex decodes to "KYC"
    expectSimpleRowLabel(wrapper, 'credential-type-0', 'credential_type')

    // Check second credential
    expectSimpleRowText(wrapper, 'credential-issuer-1', 'rTRUSTED.....')
    expectSimpleRowLabel(wrapper, 'credential-issuer-1', 'credential_issuer')
    expectSimpleRowText(wrapper, 'credential-type-1', 'ID') // 4944 hex decodes to "ID"
    expectSimpleRowLabel(wrapper, 'credential-type-1', 'credential_type')

    wrapper.unmount()
  })

  it('renders unauthorize credentials', () => {
    const wrapper = createWrapper(mockDepositPreauthUnauthorizeCredentials)

    // Check that SimpleGroup is rendered
    expect(wrapper.find('.group')).toHaveLength(1)
    expect(wrapper.find('.groups-title')).toHaveLength(1)

    expectSimpleRowText(wrapper, 'credential-issuer-0', 'rISABEL......')
    expectSimpleRowLabel(wrapper, 'credential-issuer-0', 'credential_issuer')
    expectSimpleRowText(wrapper, 'credential-type-0', 'KYC') // 4B5943 hex decodes to "KYC"
    expectSimpleRowLabel(wrapper, 'credential-type-0', 'credential_type')

    wrapper.unmount()
  })
})
