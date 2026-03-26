import {
  createSimpleRenderFactory,
  expectSimpleRowText,
  expectSimpleRowLabel,
} from '../../test'
import { Simple } from '../Simple'
import mockDepositPreauth from './mock_data/DepositPreauth.json'
import mockDepositPreauthUnauthorize from './mock_data/DepositPreauthUnauthorize.json'
import mockDepositPreauthAuthorizeCredentials from './mock_data/DepositPreauthAuthorizeCredentials.json'
import mockDepositPreauthUnauthorizeCredentials from './mock_data/DepositPreauthUnauthorizeCredentials.json'

const renderComponent = createSimpleRenderFactory(Simple)

describe('DepositPreauth: Simple', () => {
  it('renders authorized', () => {
    const { container, unmount } = renderComponent(mockDepositPreauth)
    expectSimpleRowText(
      container,
      'authorize',
      'rDJFnv5sEfp42LMFiX3mVQKczpFTdxYDzM',
    )
    unmount()
  })

  it('renders unauthorized', () => {
    const { container, unmount } = renderComponent(
      mockDepositPreauthUnauthorize,
    )
    expectSimpleRowText(
      container,
      'unauthorize',
      'rDJFnv5sEfp42LMFiX3mVQKczpFTdxYDzM',
    )
    unmount()
  })

  it('renders authorize credentials', () => {
    const { container, unmount } = renderComponent(
      mockDepositPreauthAuthorizeCredentials,
    )

    // Check that SimpleGroup is rendered
    expect(container.querySelectorAll('.group')).toHaveLength(2)
    expect(container.querySelectorAll('.groups-title')).toHaveLength(1)

    // Check first credential
    expectSimpleRowText(container, 'credential-issuer-0', 'rISABEL......')
    expectSimpleRowLabel(container, 'credential-issuer-0', 'credential_issuer')
    expectSimpleRowText(container, 'credential-type-0', 'KYC') // 4B5943 hex decodes to "KYC"
    expectSimpleRowLabel(container, 'credential-type-0', 'credential_type')

    // Check second credential
    expectSimpleRowText(container, 'credential-issuer-1', 'rTRUSTED.....')
    expectSimpleRowLabel(container, 'credential-issuer-1', 'credential_issuer')
    expectSimpleRowText(container, 'credential-type-1', 'ID') // 4944 hex decodes to "ID"
    expectSimpleRowLabel(container, 'credential-type-1', 'credential_type')

    unmount()
  })

  it('renders unauthorize credentials', () => {
    const { container, unmount } = renderComponent(
      mockDepositPreauthUnauthorizeCredentials,
    )

    // Check that SimpleGroup is rendered
    expect(container.querySelectorAll('.group')).toHaveLength(1)
    expect(container.querySelectorAll('.groups-title')).toHaveLength(1)

    expectSimpleRowText(container, 'credential-issuer-0', 'rISABEL......')
    expectSimpleRowLabel(container, 'credential-issuer-0', 'credential_issuer')
    expectSimpleRowText(container, 'credential-type-0', 'KYC') // 4B5943 hex decodes to "KYC"
    expectSimpleRowLabel(container, 'credential-type-0', 'credential_type')

    unmount()
  })
})
