import { cleanup, screen } from '@testing-library/react'
import i18n from '../../../../../../i18n/testConfigEnglish'

import mockDepositPreauth from './mock_data/DepositPreauth.json'
import mockDepositPreauthUnauthorize from './mock_data/DepositPreauthUnauthorize.json'
import mockDepositPreauthAuthorizeCredentials from './mock_data/DepositPreauthAuthorizeCredentials.json'
import mockDepositPreauthUnauthorizeCredentials from './mock_data/DepositPreauthUnauthorizeCredentials.json'

import { Description } from '../Description'
import { createDescriptionRenderFactory } from '../../test'

const renderComponent = createDescriptionRenderFactory(Description, i18n)

describe('DepositPreauth: Description', () => {
  afterEach(cleanup)
  it('renders description for authorize', () => {
    renderComponent(mockDepositPreauth)
    expect(screen.getByTestId('deposit-auth')).toHaveTextContent(
      'It authorizes rDJFnv5sEfp42LMFiX3mVQKczpFTdxYDzM to send payments to this account',
    )
    expect(
      screen.getByText('rDJFnv5sEfp42LMFiX3mVQKczpFTdxYDzM'),
    ).toHaveAttribute('href')
  })

  it('renders description for unauthorize', () => {
    renderComponent(mockDepositPreauthUnauthorize)

    expect(screen.getByTestId('deposit-unauth')).toHaveTextContent(
      'It removes the authorization for rDJFnv5sEfp42LMFiX3mVQKczpFTdxYDzM to send payments to this account',
    )
    expect(
      screen.getByText('rDJFnv5sEfp42LMFiX3mVQKczpFTdxYDzM'),
    ).toHaveAttribute('href')
  })

  it('renders description for authorize credentials', () => {
    const wrapper = createWrapper(mockDepositPreauthAuthorizeCredentials)
    const html = wrapper.html()
    expect(html).toContain('It authorizes the following credentials:')
    expect(html).toContain('KYC')
    expect(html).toContain('rISABEL')
    expect(html).toContain('ID')
    expect(html).toContain('rTRUSTED')
    wrapper.unmount()
  })

  it('renders description for unauthorize credentials', () => {
    const wrapper = createWrapper(mockDepositPreauthUnauthorizeCredentials)
    const html = wrapper.html()
    expect(html).toContain(
      'It removes the authorization for the following credentials:',
    )
    expect(html).toContain('KYC')
    expect(html).toContain('rISABEL')
    wrapper.unmount()
  })
})
