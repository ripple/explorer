import i18n from '../../../../../../i18n/testConfigEnglish'

import { createSimpleWrapperFactory, expectSimpleRowText, expectSimpleRowLabel } from '../../test'
import { Simple } from '../Simple'
import mockDepositPreauth from './mock_data/DepositPreauth.json'
import mockDepositPreauthUnauthorize from './mock_data/DepositPreauthUnauthorize.json'
import mockDepositPreauthAuthorizeCredentials from './mock_data/DepositPreauthAuthorizeCredentials.json'
import mockDepositPreauthUnauthorizeCredentials from './mock_data/DepositPreauthUnauthorizeCredentials.json'

const createWrapper = createSimpleWrapperFactory(Simple)

describe('DepositPreauth: Simple', () => {
  it('renders authorized', () => {
    const wrapper = createWrapper(mockDepositPreauth)
    expectSimpleRowText(wrapper, 'authorize', 'rDJFnv5sEfp42LMFiX3mVQKczpFTdxYDzM')
    wrapper.unmount()
  })

  it('renders unauthorized', () => {
    const wrapper = createWrapper(mockDepositPreauthUnauthorize)
    expectSimpleRowText(wrapper, 'unauthorize', 'rDJFnv5sEfp42LMFiX3mVQKczpFTdxYDzM')
    wrapper.unmount()
  })

  it('renders authorize credentials', () => {
    const wrapper = createWrapper(mockDepositPreauthAuthorizeCredentials)
    
    expectSimpleRowText(wrapper, 'authorize-credentials-label', 'accepted_credentials')
    expectSimpleRowLabel(wrapper, 'authorize-credentials-label', 'authorize')
    
    // Check first credential
    expectSimpleRowText(wrapper, 'credential-issuer-0', 'rISABEL......')
    expectSimpleRowLabel(wrapper, 'credential-issuer-0', 'credential_issuer')
    expectSimpleRowText(wrapper, 'credential-type-0', 'KYC') // 4B5943 hex decodes to "KYC"
    expectSimpleRowLabel(wrapper, 'credential-type-0', 'credential_type')
    
    // Check second credential
    expectSimpleRowText(wrapper, 'credential-issuer-1', 'rTRUSTED.....')
    expectSimpleRowLabel(wrapper, 'credential-issuer-1', '') // Empty label for subsequent items
    expectSimpleRowText(wrapper, 'credential-type-1', 'ID') // 4944 hex decodes to "ID"
    expectSimpleRowLabel(wrapper, 'credential-type-1', '') // Empty label for subsequent items
    
    wrapper.unmount()
  })

  it('renders unauthorize credentials', () => {
    const wrapper = createWrapper(mockDepositPreauthUnauthorizeCredentials)
    
    expectSimpleRowText(wrapper, 'unauthorize-credentials-label', 'accepted_credentials')
    expectSimpleRowLabel(wrapper, 'unauthorize-credentials-label', 'unauthorize')
    
    expectSimpleRowText(wrapper, 'credential-issuer-0', 'rISABEL......')
    expectSimpleRowLabel(wrapper, 'credential-issuer-0', 'credential_issuer')
    expectSimpleRowText(wrapper, 'credential-type-0', 'KYC') // 4B5943 hex decodes to "KYC"
    expectSimpleRowLabel(wrapper, 'credential-type-0', 'credential_type')
    
    wrapper.unmount()
  })
})
