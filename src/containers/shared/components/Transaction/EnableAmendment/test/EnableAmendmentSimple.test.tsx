import i18n from '../../../../../../i18nTestConfig.en-US'
import { expectSimpleRowLabel, expectSimpleRowText } from '../../test'
import { createSimpleWrapperFactory } from '../../test/createWrapperFactory'

import { Simple } from '../Simple'
import mockEnableAmendmentWithEnabled from './mock_data/EnableAmendmentWithEnabled.json'
import mockEnableAmendmentWithMinority from './mock_data/EnableAmendmentWithMinority.json'
import mockEnableAmendmentWithMajority from './mock_data/EnableAmendmentWithMajority.json'
import {
  getRippledVersion,
  nameOfAmendmentID,
} from '../../../../amendmentUtils'

const createWrapper = createSimpleWrapperFactory(Simple, i18n)

jest.mock('../../../../amendmentUtils', () => {
  // Require the original module to not be mocked...
  const originalModule = jest.requireActual('../../../../amendmentUtils')
  return {
    __esModule: true,
    ...originalModule,
    getRippledVersion: jest.fn(),
    nameOfAmendmentID: jest.fn(),
  }
})

function flushPromises() {
  return new Promise((resolve) => setImmediate(resolve))
}

describe('EnableAmendment: Simple', () => {
  it('renders tx that causes an amendment to loose majority', async () => {
    getRippledVersion.mockImplementation(() => Promise.resolve('v1.9.1'))
    nameOfAmendmentID.mockImplementation(() =>
      Promise.resolve('ExpandedSignerList'),
    )
    const wrapper = createWrapper(mockEnableAmendmentWithMinority)
    expectSimpleRowLabel(wrapper, 'name', 'Amendment Name')
    expectSimpleRowText(wrapper, 'name', 'Loading')
    expectSimpleRowLabel(wrapper, 'status', 'Amendment Status')
    expectSimpleRowText(wrapper, 'status', 'Lost Majority')
    expectSimpleRowLabel(wrapper, 'version', 'Introduced In')
    expectSimpleRowText(wrapper, 'version', 'Loading')
    expect(wrapper.find('[data-test="date"]')).not.toExist()

    await flushPromises()
    wrapper.update()

    expectSimpleRowText(wrapper, 'name', 'ExpandedSignerList')
    expectSimpleRowText(wrapper, 'version', 'v1.9.1')

    wrapper.unmount()
  })

  it('renders tx that causes an amendment to gain majority', async () => {
    getRippledVersion.mockImplementation(() => Promise.resolve('v1.9.1'))
    nameOfAmendmentID.mockImplementation(() =>
      Promise.resolve('ExpandedSignerList'),
    )
    const wrapper = createWrapper(mockEnableAmendmentWithMajority)
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

    wrapper.unmount()
  })

  it('renders tx that enables an amendment', async () => {
    getRippledVersion.mockImplementation(() => Promise.resolve('v1.7.3'))
    nameOfAmendmentID.mockImplementation(() => Promise.resolve('NegativeUNL'))
    const wrapper = createWrapper(mockEnableAmendmentWithEnabled)
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
    getRippledVersion.mockImplementation(() => Promise.resolve(''))
    nameOfAmendmentID.mockImplementation(() => Promise.resolve(''))
    const wrapper = createWrapper(mockEnableAmendmentWithEnabled)
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
    getRippledVersion.mockImplementation(() => Promise.resolve(''))
    nameOfAmendmentID.mockImplementation(() => Promise.resolve('NegativeUNL'))
    const wrapper = createWrapper(mockEnableAmendmentWithEnabled)
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
    getRippledVersion.mockImplementation(() => Promise.resolve('v1.7.3'))
    nameOfAmendmentID.mockImplementation(() => Promise.resolve(''))
    const wrapper = createWrapper(mockEnableAmendmentWithEnabled)
    expectSimpleRowLabel(wrapper, 'name', 'Amendment Name')
    expectSimpleRowText(wrapper, 'name', 'Loading')
    expectSimpleRowLabel(wrapper, 'version', 'Introduced In')
    expectSimpleRowText(wrapper, 'version', 'Loading')

    await flushPromises()
    wrapper.update()

    expectSimpleRowText(wrapper, 'name', 'Unknown')
    expectSimpleRowText(wrapper, 'version', 'Unknown')
  })
})
