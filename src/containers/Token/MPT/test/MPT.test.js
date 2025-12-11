import * as React from 'react'
import { mount } from 'enzyme'
import { Route } from 'react-router-dom'
import { MPT } from '..'
import i18n from '../../../../i18n/testConfig'
import { QuickHarness } from '../../../test/utils'
import { MPT_ROUTE } from '../../../App/routes'

describe('MPT container', () => {
  const mptID = '00000F6D5186FB5C90A8112419BED54193EDC7218835C6F5'

  const createWrapper = (mpt = undefined) =>
    mount(
      <QuickHarness i18n={i18n} initialEntries={[`/mpt/${mpt}`]}>
        <Route path={MPT_ROUTE.path} element={<MPT />} />
      </QuickHarness>,
    )

  it('renders without crashing', () => {
    const wrapper = createWrapper(mptID)
    wrapper.unmount()
  })

  it('renders loader while loading', () => {
    const wrapper = createWrapper(mptID)
    // While loading, Loader is shown (Header is not rendered until data loads)
    expect(wrapper.find('Loader').length).toBe(1)
    wrapper.unmount()
  })

  it('renders loader when undefined mpt provided', () => {
    // When no mptId is provided, URL is /mpt/undefined which still triggers loading
    const wrapper = createWrapper()
    expect(wrapper.find('Loader').length).toBe(1)
    wrapper.unmount()
  })

  // Note: Testing error state requires async handling since errors are
  // triggered by failed queries or Header validation, both of which happen
  // after initial render. Consider using @testing-library/react with
  // waitFor for proper async testing.
})
