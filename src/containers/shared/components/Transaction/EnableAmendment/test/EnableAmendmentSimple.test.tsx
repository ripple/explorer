import { cleanup, screen } from '@testing-library/react'
import i18n from '../../../../../../i18n/testConfigEnglish'
import { expectSimpleRowLabel, expectSimpleRowText } from '../../test'
import { createSimpleRenderFactory } from '../../test/createRenderFactory'

import { Simple } from '../Simple'
import mockEnableAmendmentWithEnabled from './mock_data/EnableAmendmentWithEnabled.json'
import mockEnableAmendmentWithMinority from './mock_data/EnableAmendmentWithMinority.json'
import mockEnableAmendmentWithMajority from './mock_data/EnableAmendmentWithMajority.json'
import mockFeatureExpandedSignerList from './mock_data/FeatureExpandedSignerList.json'
import mockFeatureNegativeUNL from './mock_data/FeatureNegativeUNL.json'
import { getRippledVersion } from '../../../../amendmentUtils'
import { flushPromises } from '../../../../../test/utils'
import { getFeature } from '../../../../../../rippled/lib/rippled'

const renderComponent = createSimpleRenderFactory(Simple, i18n)

jest.mock('../../../../amendmentUtils', () => {
  // Require the original module to not be mocked...
  const originalModule = jest.requireActual('../../../../amendmentUtils')
  return {
    __esModule: true,
    ...originalModule,
    getRippledVersion: jest.fn(),
  }
})

jest.mock('../../../../../../rippled/lib/rippled', () => {
  const originalModule = jest.requireActual(
    '../../../../../../rippled/lib/rippled',
  )

  return {
    __esModule: true,
    ...originalModule,
    getFeature: jest.fn(),
  }
})

const mockedGetRippledVersion = getRippledVersion as jest.MockedFunction<
  typeof getRippledVersion
>

const mockedGetFeature = getFeature as jest.MockedFunction<typeof getFeature>

describe('EnableAmendment: Simple', () => {
  afterEach(() => {
    mockedGetFeature.mockReset()
    cleanup()
  })
  it('renders tx that causes an amendment to loose majority', async () => {
    mockedGetRippledVersion.mockImplementation(() => Promise.resolve('v1.9.1'))
    mockedGetFeature.mockImplementation(() =>
      Promise.resolve(mockFeatureExpandedSignerList),
    )
    renderComponent(mockEnableAmendmentWithMinority)
    expectSimpleRowLabel(screen, 'name', 'Amendment Name')
    expectSimpleRowText(screen, 'name', 'Loading')
    expectSimpleRowLabel(screen, 'status', 'Amendment Status')
    expectSimpleRowText(screen, 'status', 'Lost Majority')
    expectSimpleRowLabel(screen, 'version', 'Introduced In')
    expectSimpleRowText(screen, 'version', 'Loading')
    expect(screen.find('[data-testid="date"]')).not.toExist()

    await flushPromises()

    expectSimpleRowText(screen, 'name', 'ExpandedSignerList')
    expectSimpleRowText(screen, 'version', 'v1.9.1')
  })

  it('renders tx that causes an amendment to gain majority', async () => {
    mockedGetRippledVersion.mockImplementation(() => Promise.resolve('v1.9.1'))
    mockedGetFeature.mockImplementation(() =>
      Promise.resolve(mockFeatureExpandedSignerList),
    )
    renderComponent(mockEnableAmendmentWithMajority)
    expectSimpleRowLabel(screen, 'name', 'Amendment Name')
    expectSimpleRowText(screen, 'name', 'Loading')
    expectSimpleRowLabel(screen, 'status', 'Amendment Status')
    expectSimpleRowText(screen, 'status', 'Got Majority')
    expectSimpleRowLabel(screen, 'version', 'Introduced In')
    expectSimpleRowText(screen, 'version', 'Loading')
    expectSimpleRowLabel(screen, 'date', 'Expected Date')
    expectSimpleRowText(screen, 'date', '10/13/2022, 3:28:31 PM')

    await flushPromises()

    expectSimpleRowText(screen, 'name', 'ExpandedSignerList')
    expectSimpleRowText(screen, 'version', 'v1.9.1')
    expect(screen.find('[data-testid="name"] .value a')).toHaveProp(
      'href',
      '/amendment/B2A4DB846F0891BF2C76AB2F2ACC8F5B4EC64437135C6E56F3F859DE5FFD5856',
    )
  })

  it('renders tx that enables an amendment', async () => {
    mockedGetRippledVersion.mockImplementation(() => Promise.resolve('v1.7.3'))
    mockedGetFeature.mockImplementation(() =>
      Promise.resolve(mockFeatureNegativeUNL),
    )
    renderComponent(mockEnableAmendmentWithEnabled)
    expectSimpleRowLabel(screen, 'name', 'Amendment Name')
    expectSimpleRowText(screen, 'name', 'Loading')
    expectSimpleRowLabel(screen, 'status', 'Amendment Status')
    expectSimpleRowText(screen, 'status', 'Enabled')
    expectSimpleRowLabel(screen, 'version', 'Introduced In')
    expectSimpleRowText(screen, 'version', 'Loading')

    await flushPromises()

    expectSimpleRowText(screen, 'name', 'NegativeUNL')
    expectSimpleRowText(screen, 'version', 'v1.7.3')
  })

  it('renders tx that cannot determine version or name', async () => {
    mockedGetRippledVersion.mockImplementation(() => Promise.resolve(''))
    mockedGetFeature.mockImplementation(() => Promise.resolve(null))
    renderComponent(mockEnableAmendmentWithEnabled)
    renderComponent(mockEnableAmendmentWithEnabled)
    expectSimpleRowLabel(screen, 'name', 'Amendment Name')
    expectSimpleRowText(screen, 'name', 'Loading')
    expectSimpleRowLabel(screen, 'version', 'Introduced In')
    expectSimpleRowText(screen, 'version', 'Loading')

    await flushPromises()

    expectSimpleRowText(screen, 'name', 'Unknown')
    expectSimpleRowText(screen, 'version', 'Unknown')
  })

  it('renders tx that cannot determine version', async () => {
    mockedGetRippledVersion.mockImplementation(() => Promise.resolve(''))
    mockedGetFeature.mockImplementation(() =>
      Promise.resolve(mockFeatureNegativeUNL),
    )
    renderComponent(mockEnableAmendmentWithEnabled)
    expectSimpleRowLabel(screen, 'name', 'Amendment Name')
    expectSimpleRowText(screen, 'name', 'Loading')
    expectSimpleRowLabel(screen, 'version', 'Introduced In')
    expectSimpleRowText(screen, 'version', 'Loading')

    await flushPromises()

    expectSimpleRowText(screen, 'name', 'NegativeUNL')
    expectSimpleRowText(screen, 'version', 'Unknown')
  })

  it('renders tx that cannot determine name', async () => {
    mockedGetRippledVersion.mockImplementation(() => Promise.resolve('v1.7.3'))
    mockedGetFeature.mockImplementation(() => Promise.resolve(null))
    renderComponent(mockEnableAmendmentWithEnabled)
    expectSimpleRowLabel(screen, 'name', 'Amendment Name')
    expectSimpleRowText(screen, 'name', 'Loading')
    expectSimpleRowLabel(screen, 'version', 'Introduced In')
    expectSimpleRowText(screen, 'version', 'Loading')

    await flushPromises()

    expectSimpleRowText(screen, 'name', 'Unknown')
    expectSimpleRowText(screen, 'version', 'v1.7.3')
  })
})
