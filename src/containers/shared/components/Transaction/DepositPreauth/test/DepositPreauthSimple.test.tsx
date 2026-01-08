import { cleanup, screen } from '@testing-library/react'
import i18n from '../../../../../../i18n/testConfigEnglish'

import { createSimpleRenderFactory } from '../../test/createRenderFactory'
import { Simple } from '../Simple'
import mockDepositPreauth from './mock_data/DepositPreauth.json'
import mockDepositPreauthUnauthorize from './mock_data/DepositPreauthUnauthorize.json'
import mockDepositPreauthAuthorizeCredentials from './mock_data/DepositPreauthAuthorizeCredentials.json'
import mockDepositPreauthUnauthorizeCredentials from './mock_data/DepositPreauthUnauthorizeCredentials.json'
import { expectSimpleRowLabel, expectSimpleRowText } from '../../test'

const renderComponent = createSimpleRenderFactory(Simple, i18n)

describe('DepositPreauth: Simple', () => {
  afterEach(cleanup)
  it('renders authorized', () => {
    renderComponent(mockDepositPreauth)
    expectSimpleRowLabel(screen, 'authorize', 'authorize')
    expectSimpleRowText(
      screen,
      'authorize',
      'rDJFnv5sEfp42LMFiX3mVQKczpFTdxYDzM',
    )
  })

  it('renders unauthorized', () => {
    renderComponent(mockDepositPreauthUnauthorize)
    expectSimpleRowLabel(screen, 'unauthorize', 'unauthorize')
    expectSimpleRowText(
      screen,
      'unauthorize',
      'rDJFnv5sEfp42LMFiX3mVQKczpFTdxYDzM',
    )
  })

  it('renders authorize credentials', () => {
    renderComponent(mockDepositPreauthAuthorizeCredentials)

    // Check that SimpleGroup is rendered
    expect(screen.getAllByTestId('simple-group')).toHaveLength(2)
    expect(screen.getByText('authorize_credentials')).toBeDefined()

    // Check first credential
    expectSimpleRowText(screen, 'credential-issuer-0', 'rISABEL......')
    expectSimpleRowLabel(screen, 'credential-issuer-0', 'credential_issuer')
    expectSimpleRowText(screen, 'credential-type-0', 'KYC') // 4B5943 hex decodes to "KYC"
    expectSimpleRowLabel(screen, 'credential-type-0', 'credential_type')

    // Check second credential
    expectSimpleRowText(screen, 'credential-issuer-1', 'rTRUSTED.....')
    expectSimpleRowLabel(screen, 'credential-issuer-1', 'credential_issuer')
    expectSimpleRowText(screen, 'credential-type-1', 'ID') // 4944 hex decodes to "ID"
    expectSimpleRowLabel(screen, 'credential-type-1', 'credential_type')
  })

  it('renders unauthorize credentials', () => {
    renderComponent(mockDepositPreauthUnauthorizeCredentials)

    // Check that SimpleGroup is rendered
    expect(screen.getAllByTestId('simple-group')).toHaveLength(1)
    expect(screen.getByText('unauthorize_credentials')).toBeDefined()

    expectSimpleRowText(screen, 'credential-issuer-0', 'rISABEL......')
    expectSimpleRowLabel(screen, 'credential-issuer-0', 'credential_issuer')
    expectSimpleRowText(screen, 'credential-type-0', 'KYC') // 4B5943 hex decodes to "KYC"
    expectSimpleRowLabel(screen, 'credential-type-0', 'credential_type')
  })
})
