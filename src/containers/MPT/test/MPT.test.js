import * as React from 'react'
import { mount } from 'enzyme'
import { Route } from 'react-router-dom'
import { MPT } from '../MPT'
import i18n from '../../../i18n/testConfig'
import { QuickHarness } from '../../test/utils'
import { MPT_ROUTE } from '../../App/routes'

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

  it('renders children', () => {
    const wrapper = createWrapper(mptID)
    expect(wrapper.find('MPTHeader').length).toBe(1)
    wrapper.unmount()
  })

  it('does not render when no mpt provided', () => {
    const wrapper = createWrapper()
    expect(wrapper.find('MPTHeader').length).toBe(0)
    wrapper.unmount()
  })

  it('renders error', () => {
    jest.mock('../MPTHeader/MPTHeader', () => ({
      NFTHeader: ({ setError }) => {
        setError(404)
      },
    }))

    const wrapper = createWrapper('something')
    expect(wrapper.find('NoMatch').length).toBe(1)
  })
})
