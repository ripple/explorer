import { waitFor } from '@testing-library/react'
import i18n from '../../../../../../i18n/testConfigEnglish'
import {
  expectSimpleRowLabel,
  expectSimpleRowNotToExist,
  expectSimpleRowText,
} from '../../test'
import { createSimpleRenderFactory } from '../../test/createWrapperFactory'

import { Simple } from '../Simple'
import mockEnableAmendmentWithEnabled from './mock_data/EnableAmendmentWithEnabled.json'
import mockEnableAmendmentWithMinority from './mock_data/EnableAmendmentWithMinority.json'
import mockEnableAmendmentWithMajority from './mock_data/EnableAmendmentWithMajority.json'
import mockFeatureExpandedSignerList from './mock_data/FeatureExpandedSignerList.json'
import mockFeatureNegativeUNL from './mock_data/FeatureNegativeUNL.json'
import { getRippledVersion } from '../../../../amendmentUtils'
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
  })
  it('renders tx that causes an amendment to loose majority', async () => {
    mockedGetRippledVersion.mockImplementation(() => Promise.resolve('v1.9.1'))
    mockedGetFeature.mockImplementation(() =>
      Promise.resolve(mockFeatureExpandedSignerList),
    )
    const { container, unmount } = renderComponent(
      mockEnableAmendmentWithMinority,
    )
    expectSimpleRowLabel(container, 'name', 'Amendment Name')
    expectSimpleRowText(container, 'name', 'Loading')
    expectSimpleRowLabel(container, 'status', 'Amendment Status')
    expectSimpleRowText(container, 'status', 'Lost Majority')
    expectSimpleRowLabel(container, 'version', 'Introduced In')
    expectSimpleRowText(container, 'version', 'Loading')
    expectSimpleRowNotToExist(container, 'date')

    await waitFor(() => {
      expectSimpleRowText(container, 'name', 'ExpandedSignerList')
    })
    expectSimpleRowText(container, 'version', 'v1.9.1')

    unmount()
  })

  it('renders tx that causes an amendment to gain majority', async () => {
    mockedGetRippledVersion.mockImplementation(() => Promise.resolve('v1.9.1'))
    mockedGetFeature.mockImplementation(() =>
      Promise.resolve(mockFeatureExpandedSignerList),
    )
    const { container, unmount } = renderComponent(
      mockEnableAmendmentWithMajority,
    )
    expectSimpleRowLabel(container, 'name', 'Amendment Name')
    expectSimpleRowText(container, 'name', 'Loading')
    expectSimpleRowLabel(container, 'status', 'Amendment Status')
    expectSimpleRowText(container, 'status', 'Got Majority')
    expectSimpleRowLabel(container, 'version', 'Introduced In')
    expectSimpleRowText(container, 'version', 'Loading')
    expectSimpleRowLabel(container, 'date', 'Expected Date')
    expectSimpleRowText(container, 'date', '10/13/2022, 3:28:31 PM')

    await waitFor(() => {
      expectSimpleRowText(container, 'name', 'ExpandedSignerList')
    })
    expectSimpleRowText(container, 'version', 'v1.9.1')
    expect(
      container.querySelector('[data-testid="name"] .value a'),
    ).toHaveAttribute(
      'href',
      '/amendment/B2A4DB846F0891BF2C76AB2F2ACC8F5B4EC64437135C6E56F3F859DE5FFD5856',
    )

    unmount()
  })

  it('renders tx that enables an amendment', async () => {
    mockedGetRippledVersion.mockImplementation(() => Promise.resolve('v1.7.3'))
    mockedGetFeature.mockImplementation(() =>
      Promise.resolve(mockFeatureNegativeUNL),
    )
    const { container, unmount } = renderComponent(
      mockEnableAmendmentWithEnabled,
    )
    expectSimpleRowLabel(container, 'name', 'Amendment Name')
    expectSimpleRowText(container, 'name', 'Loading')
    expectSimpleRowLabel(container, 'status', 'Amendment Status')
    expectSimpleRowText(container, 'status', 'Enabled')
    expectSimpleRowLabel(container, 'version', 'Introduced In')
    expectSimpleRowText(container, 'version', 'Loading')

    await waitFor(() => {
      expectSimpleRowText(container, 'name', 'NegativeUNL')
    })
    expectSimpleRowText(container, 'version', 'v1.7.3')

    unmount()
  })

  it('renders tx that cannot determine version or name', async () => {
    mockedGetRippledVersion.mockImplementation(() => Promise.resolve(''))
    mockedGetFeature.mockImplementation(() => Promise.resolve(null))
    const { container } = renderComponent(mockEnableAmendmentWithEnabled)
    expectSimpleRowLabel(container, 'name', 'Amendment Name')
    expectSimpleRowText(container, 'name', 'Loading')
    expectSimpleRowLabel(container, 'version', 'Introduced In')
    expectSimpleRowText(container, 'version', 'Loading')

    await waitFor(() => {
      expectSimpleRowText(container, 'name', 'Unknown')
    })
    expectSimpleRowText(container, 'version', 'Unknown')
  })

  it('renders tx that cannot determine version', async () => {
    mockedGetRippledVersion.mockImplementation(() => Promise.resolve(''))
    mockedGetFeature.mockImplementation(() =>
      Promise.resolve(mockFeatureNegativeUNL),
    )
    const { container } = renderComponent(mockEnableAmendmentWithEnabled)
    expectSimpleRowLabel(container, 'name', 'Amendment Name')
    expectSimpleRowText(container, 'name', 'Loading')
    expectSimpleRowLabel(container, 'version', 'Introduced In')
    expectSimpleRowText(container, 'version', 'Loading')

    await waitFor(() => {
      expectSimpleRowText(container, 'name', 'NegativeUNL')
    })
    expectSimpleRowText(container, 'version', 'Unknown')
  })

  it('renders tx that cannot determine name', async () => {
    mockedGetRippledVersion.mockImplementation(() => Promise.resolve('v1.7.3'))
    mockedGetFeature.mockImplementation(() => Promise.resolve(null))
    const { container } = renderComponent(mockEnableAmendmentWithEnabled)
    expectSimpleRowLabel(container, 'name', 'Amendment Name')
    expectSimpleRowText(container, 'name', 'Loading')
    expectSimpleRowLabel(container, 'version', 'Introduced In')
    expectSimpleRowText(container, 'version', 'Loading')

    await waitFor(() => {
      expectSimpleRowText(container, 'name', 'Unknown')
    })
    expectSimpleRowText(container, 'version', 'v1.7.3')
  })
})
