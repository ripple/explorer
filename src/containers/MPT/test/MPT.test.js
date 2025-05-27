import * as React from 'react'
import { render, screen, cleanup } from '@testing-library/react'
import { Route } from 'react-router-dom'
import { MPT } from '../MPT'
import i18n from '../../../i18n/testConfig'
import { QuickHarness } from '../../test/utils'
import { MPT_ROUTE } from '../../App/routes'

describe('MPT container', () => {
  const mptID = '00000F6D5186FB5C90A8112419BED54193EDC7218835C6F5'

  const renderComponent = (mpt = undefined) =>
    render(
      <QuickHarness i18n={i18n} initialEntries={[`/mpt/${mpt}`]}>
        <Route path={MPT_ROUTE.path} element={<MPT />} />
      </QuickHarness>,
    )

  afterEach(cleanup)

  it('renders without crashing', () => {
    renderComponent(mptID)
  })

  it('renders children', () => {
    renderComponent(mptID)
    expect(screen.queryByTestId('mpt-header')).toBeDefined()
  })

  it('does not render when no mpt provided', () => {
    renderComponent()
    expect(screen.queryByTestId('mpt-header')).toBeNull()
  })

  it('renders error', () => {
    jest.mock('../MPTHeader/MPTHeader', () => ({
      NFTHeader: ({ setError }) => {
        setError(404)
      },
    }))

    renderComponent('something')
    expect(screen.queryByTitle('no-match')).toBeDefined()
  })
})
