import i18n from '../../../../../../i18n/testConfigEnglish'

import mockDepositPreaut from './mock_data/DepositPreauth.json'
import mockDepositPreauthUnauthorize from './mock_data/DepositPreauthUnauthorize.json'

import { Description } from '../Description'
import { createDescriptionRenderFactory } from '../../test'

const createWrapper = createDescriptionRenderFactory(Description, i18n)

describe('DepositPreauth: Description', () => {
  it('renders description for authorize', () => {
    const wrapper = createWrapper(mockDepositPreaut)
    expect(wrapper.html()).toBe(
      `<div>It authorizes <a data-testid="account" title="rDJFnv5sEfp42LMFiX3mVQKczpFTdxYDzM" class="account" href="/accounts/rDJFnv5sEfp42LMFiX3mVQKczpFTdxYDzM">rDJFnv5sEfp42LMFiX3mVQKczpFTdxYDzM</a> to send payments to this account</div>`,
    )
    wrapper.unmount()
  })

  it('renders description for unauthorize', () => {
    const wrapper = createWrapper(mockDepositPreauthUnauthorize)
    expect(wrapper.html()).toBe(
      `<div>It removes the authorization for <a data-testid="account" title="rDJFnv5sEfp42LMFiX3mVQKczpFTdxYDzM" class="account" href="/accounts/rDJFnv5sEfp42LMFiX3mVQKczpFTdxYDzM">rDJFnv5sEfp42LMFiX3mVQKczpFTdxYDzM</a> to send payments to this account</div>`,
    )
    wrapper.unmount()
  })
})
