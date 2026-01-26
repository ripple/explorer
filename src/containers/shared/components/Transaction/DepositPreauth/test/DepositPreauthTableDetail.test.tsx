import { createTableDetailRenderFactory } from '../../test'
import { TableDetail } from '../TableDetail'
import mockDepositPreauth from './mock_data/DepositPreauth.json'
import mockDepositPreauthAuthorizeCredentials from './mock_data/DepositPreauthAuthorizeCredentials.json'
import mockDepositPreauthUnauthorize from './mock_data/DepositPreauthUnauthorize.json'
import mockDepositPreauthUnauthorizeCredentials from './mock_data/DepositPreauthUnauthorizeCredentials.json'
import i18n from '../../../../../../i18n/testConfigEnglish'

const renderComponent = createTableDetailRenderFactory(TableDetail, i18n)

describe('DepositPreauthTableDetail', () => {
  it('renders DepositPreauth with Authorize', () => {
    const { container, unmount } = renderComponent(mockDepositPreauth)
    expect(container.querySelector('.deposit-preauth')).toBeInTheDocument()
    expect(
      container.querySelector('.deposit-preauth .label'),
    ).toHaveTextContent('authorize')
    expect(
      container.querySelector('[data-testid="account"]'),
    ).toBeInTheDocument()
    expect(
      container.querySelector('[data-testid="account"]'),
    ).toHaveTextContent('rDJFnv5sEfp42LMFiX3mVQKczpFTdxYDzM')
    unmount()
  })

  it('renders DepositPreauth with Unauthorize', () => {
    const { container, unmount } = renderComponent(
      mockDepositPreauthUnauthorize,
    )
    expect(container.querySelector('.deposit-preauth')).toBeInTheDocument()
    expect(
      container.querySelector('.deposit-preauth .label'),
    ).toHaveTextContent('unauthorize')
    expect(
      container.querySelector('[data-testid="account"]'),
    ).toBeInTheDocument()
    expect(
      container.querySelector('[data-testid="account"]'),
    ).toHaveTextContent('rDJFnv5sEfp42LMFiX3mVQKczpFTdxYDzM')
    unmount()
  })

  it('renders DepositPreauth with AuthorizeCredentials', () => {
    const { container, unmount } = renderComponent(
      mockDepositPreauthAuthorizeCredentials,
    )
    expect(container.querySelector('.deposit-preauth')).toBeInTheDocument()
    expect(
      container.querySelector('.deposit-preauth .label'),
    ).toHaveTextContent('authorize Accepted Credentials')
    expect(container.querySelector('.credentials')).toBeInTheDocument()
    expect(container.querySelectorAll('.credential')).toHaveLength(2)
    const credentialTypes = container.querySelectorAll('.credential-type')
    expect(credentialTypes[0]).toHaveTextContent('KYC')
    expect(credentialTypes[1]).toHaveTextContent('ID')
    unmount()
  })

  it('renders DepositPreauth with UnauthorizeCredentials', () => {
    const { container, unmount } = renderComponent(
      mockDepositPreauthUnauthorizeCredentials,
    )
    expect(container.querySelector('.deposit-preauth')).toBeInTheDocument()
    expect(
      container.querySelector('.deposit-preauth .label'),
    ).toHaveTextContent('unauthorize Accepted Credentials')
    expect(container.querySelector('.credentials')).toBeInTheDocument()
    expect(container.querySelectorAll('.credential')).toHaveLength(1)
    expect(container.querySelector('.credential-type')).toHaveTextContent('KYC')
    unmount()
  })
})
