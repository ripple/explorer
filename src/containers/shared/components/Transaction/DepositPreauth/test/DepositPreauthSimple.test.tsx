import { cleanup, screen } from '@testing-library/react'
import i18n from '../../../../../../i18n/testConfigEnglish'

import { createSimpleRenderFactory } from '../../test/createRenderFactory'
import { Simple } from '../Simple'
import mockDepositPreauth from './mock_data/DepositPreauth.json'
import mockDepositPreauthUnauthorize from './mock_data/DepositPreauthUnauthorize.json'
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
})
