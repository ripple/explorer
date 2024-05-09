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
    expectSimpleRowLabel(wrapper, 'name', 'Amendment Name')
    expectSimpleRowText(wrapper, 'name', 'Loading')
    expectSimpleRowLabel(wrapper, 'status', 'Amendment Status')
    expectSimpleRowText(wrapper, 'status', 'Lost Majority')
    expectSimpleRowLabel(wrapper, 'version', 'Introduced In')
    expectSimpleRowText(wrapper, 'version', 'Loading')
    expect(wrapper.find('[data-testid="date"]')).not.toExist()

    await flushPromises()
    wrapper.update()

    expectSimpleRowText(wrapper, 'name', 'ExpandedSignerList')
    expectSimpleRowText(wrapper, 'version', 'v1.9.1')

    wrapper.unmount()
  })

  it('renders tx that causes an amendment to gain majority', async () => {
    mockedGetRippledVersion.mockImplementation(() => Promise.resolve('v1.9.1'))
    mockedGetFeature.mockImplementation(() =>
      Promise.resolve(mockFeatureExpandedSignerList),
    )
    renderComponent(mockEnableAmendmentWithMajority)
    expectSimpleRowLabel(wrapper, 'name', 'Amendment Name')
    expectSimpleRowText(wrapper, 'name', 'Loading')
    expectSimpleRowLabel(wrapper, 'status', 'Amendment Status')
    expectSimpleRowText(wrapper, 'status', 'Got Majority')
    expectSimpleRowLabel(wrapper, 'version', 'Introduced In')
    expectSimpleRowText(wrapper, 'version', 'Loading')
    expectSimpleRowLabel(wrapper, 'date', 'Expected Date')
    expectSimpleRowText(wrapper, 'date', '10/13/2022, 3:28:31 PM')

    await flushPromises()
    wrapper.update()

    expectSimpleRowText(wrapper, 'name', 'ExpandedSignerList')
    expectSimpleRowText(wrapper, 'version', 'v1.9.1')
    expect(wrapper.find('[data-testid="name"] .value a')).toHaveProp(
      'href',
      '/amendment/B2A4DB846F0891BF2C76AB2F2ACC8F5B4EC64437135C6E56F3F859DE5FFD5856',
    )

    wrapper.unmount()
  })

  it('renders tx that enables an amendment', async () => {
    mockedGetRippledVersion.mockImplementation(() => Promise.resolve('v1.7.3'))
    mockedGetFeature.mockImplementation(() =>
      Promise.resolve(mockFeatureNegativeUNL),
    )
    renderComponent(mockEnableAmendmentWithEnabled)
    expectSimpleRowLabel(wrapper, 'name', 'Amendment Name')
    expectSimpleRowText(wrapper, 'name', 'Loading')
    expectSimpleRowLabel(wrapper, 'status', 'Amendment Status')
    expectSimpleRowText(wrapper, 'status', 'Enabled')
    expectSimpleRowLabel(wrapper, 'version', 'Introduced In')
    expectSimpleRowText(wrapper, 'version', 'Loading')

    await flushPromises()
    wrapper.update()

    expectSimpleRowText(wrapper, 'name', 'NegativeUNL')
    expectSimpleRowText(wrapper, 'version', 'v1.7.3')

    wrapper.unmount()
  })

  it('renders tx that cannot determine version or name', async () => {
    mockedGetRippledVersion.mockImplementation(() => Promise.resolve(''))
    mockedGetFeature.mockImplementation(() => Promise.resolve(null))
    renderComponent(mockEnableAmendmentWithEnabled)
    renderComponent(mockEnableAmendmentWithEnabled)
    expectSimpleRowLabel(wrapper, 'name', 'Amendment Name')
    expectSimpleRowText(wrapper, 'name', 'Loading')
    expectSimpleRowLabel(wrapper, 'version', 'Introduced In')
    expectSimpleRowText(wrapper, 'version', 'Loading')

    await flushPromises()
    wrapper.update()

    expectSimpleRowText(wrapper, 'name', 'Unknown')
    expectSimpleRowText(wrapper, 'version', 'Unknown')
  })

  it('renders tx that cannot determine version', async () => {
    mockedGetRippledVersion.mockImplementation(() => Promise.resolve(''))
    mockedGetFeature.mockImplementation(() =>
      Promise.resolve(mockFeatureNegativeUNL),
    )
    renderComponent(mockEnableAmendmentWithEnabled)
    expectSimpleRowLabel(wrapper, 'name', 'Amendment Name')
    expectSimpleRowText(wrapper, 'name', 'Loading')
    expectSimpleRowLabel(wrapper, 'version', 'Introduced In')
    expectSimpleRowText(wrapper, 'version', 'Loading')

    await flushPromises()
    wrapper.update()

    expectSimpleRowText(wrapper, 'name', 'NegativeUNL')
    expectSimpleRowText(wrapper, 'version', 'Unknown')
  })

  it('renders tx that cannot determine name', async () => {
    mockedGetRippledVersion.mockImplementation(() => Promise.resolve('v1.7.3'))
    mockedGetFeature.mockImplementation(() => Promise.resolve(null))
    renderComponent(mockEnableAmendmentWithEnabled)
    expectSimpleRowLabel(wrapper, 'name', 'Amendment Name')
    expectSimpleRowText(wrapper, 'name', 'Loading')
    expectSimpleRowLabel(wrapper, 'version', 'Introduced In')
    expectSimpleRowText(wrapper, 'version', 'Loading')

    await flushPromises()
    wrapper.update()

    expectSimpleRowText(wrapper, 'name', 'Unknown')
    expectSimpleRowText(wrapper, 'version', 'v1.7.3')
  })
})
