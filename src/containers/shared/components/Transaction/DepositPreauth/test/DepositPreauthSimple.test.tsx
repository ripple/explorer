import i18n from '../../../../../../i18n/testConfigEnglish'

import { createSimpleRenderFactory } from '../../test/createRenderFactory'
import { Simple } from '../Simple'
import mockDepositPreauth from './mock_data/DepositPreauth.json'
import mockDepositPreauthUnauthorize from './mock_data/DepositPreauthUnauthorize.json'

const createWrapper = createSimpleRenderFactory(Simple, i18n)

describe('DepositPreauth: Simple', () => {
  it('renders authorized', () => {
    const wrapper = createWrapper(mockDepositPreauth)
    expect(wrapper.find('.label')).toHaveText('authorize')
    expect(wrapper.find('.value')).toHaveText(
      'rDJFnv5sEfp42LMFiX3mVQKczpFTdxYDzM',
    )
    wrapper.unmount()
  })

  it('renders unauthorized', () => {
    const wrapper = createWrapper(mockDepositPreauthUnauthorize)
    expect(wrapper.find('.label')).toHaveText('unauthorize')
    expect(wrapper.find('.value')).toHaveText(
      'rDJFnv5sEfp42LMFiX3mVQKczpFTdxYDzM',
    )
    wrapper.unmount()
  })
})
