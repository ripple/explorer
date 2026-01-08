import { createTableDetailWrapperFactory } from '../../test'
import { TableDetail } from '../TableDetail'
import mockDepositPreauth from './mock_data/DepositPreauth.json'
import mockDepositPreauthAuthorizeCredentials from './mock_data/DepositPreauthAuthorizeCredentials.json'
import mockDepositPreauthUnauthorize from './mock_data/DepositPreauthUnauthorize.json'
import mockDepositPreauthUnauthorizeCredentials from './mock_data/DepositPreauthUnauthorizeCredentials.json'
import i18n from '../../../../../../i18n/testConfigEnglish'

const createWrapper = createTableDetailWrapperFactory(TableDetail, i18n)

describe('DepositPreauthTableDetail', () => {
  it('renders DepositPreauth with Authorize', () => {
    const wrapper = createWrapper(mockDepositPreauth)
    expect(wrapper.find('.deposit-preauth')).toExist()
    expect(wrapper.find('.deposit-preauth .label')).toHaveText('authorize')
    expect(wrapper.find('[data-testid="account"]')).toExist()
    expect(wrapper.find('[data-testid="account"]').at(0)).toHaveText(
      'rDJFnv5sEfp42LMFiX3mVQKczpFTdxYDzM',
    )
    wrapper.unmount()
  })

  it('renders DepositPreauth with Unauthorize', () => {
    const wrapper = createWrapper(mockDepositPreauthUnauthorize)
    expect(wrapper.find('.deposit-preauth')).toExist()
    expect(wrapper.find('.deposit-preauth .label')).toHaveText('unauthorize')
    expect(wrapper.find('[data-testid="account"]')).toExist()
    expect(wrapper.find('[data-testid="account"]').at(0)).toHaveText(
      'rDJFnv5sEfp42LMFiX3mVQKczpFTdxYDzM',
    )
    wrapper.unmount()
  })

  it('renders DepositPreauth with AuthorizeCredentials', () => {
    const wrapper = createWrapper(mockDepositPreauthAuthorizeCredentials)
    expect(wrapper.find('.deposit-preauth')).toExist()
    expect(wrapper.find('.deposit-preauth .label')).toHaveText(
      'authorize Accepted Credentials',
    )
    expect(wrapper.find('.credentials')).toExist()
    expect(wrapper.find('.credential').length).toBe(2)
    expect(wrapper.find('.credential-type').at(0)).toHaveText('KYC')
    expect(wrapper.find('.credential-type').at(1)).toHaveText('ID')
    wrapper.unmount()
  })

  it('renders DepositPreauth with UnauthorizeCredentials', () => {
    const wrapper = createWrapper(mockDepositPreauthUnauthorizeCredentials)
    expect(wrapper.find('.deposit-preauth')).toExist()
    expect(wrapper.find('.deposit-preauth .label')).toHaveText(
      'unauthorize Accepted Credentials',
    )
    expect(wrapper.find('.credentials')).toExist()
    expect(wrapper.find('.credential').length).toBe(1)
    expect(wrapper.find('.credential-type').at(0)).toHaveText('KYC')
    wrapper.unmount()
  })
})
