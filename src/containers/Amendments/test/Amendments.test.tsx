import { cleanup, render, screen } from '@testing-library/react'
import moxios from 'moxios'
import { Route } from 'react-router-dom'
import i18n from '../../../i18n/testConfig'
import { Amendments } from '../index'
import NetworkContext from '../../shared/NetworkContext'
import { QuickHarness, flushPromises } from '../../test/utils'
import { AMENDMENTS_ROUTE } from '../../App/routes'
import amendmentsRaw from './mockAmendments.json'

jest.mock('usehooks-ts', () => ({
  useWindowSize: () => ({
    width: 375,
    height: 600,
  }),
}))

describe('Amendments Page container', () => {
  const renderComponent = () =>
    render(
      <NetworkContext.Provider value="main">
        <QuickHarness i18n={i18n} initialEntries={['/amendments']}>
          <Route path={AMENDMENTS_ROUTE.path} element={<Amendments />} />
        </QuickHarness>
      </NetworkContext.Provider>,
    )

  const oldEnvs = process.env

  beforeEach(() => {
    moxios.install()
    process.env = { ...oldEnvs, VITE_ENVIRONMENT: 'mainnet' }
  })

  afterEach(() => {
    moxios.uninstall()
    process.env = oldEnvs
    cleanup()
  })

  it('renders without crashing', () => {
    renderComponent()
  })

  it('renders all parts', async () => {
    moxios.stubRequest(`${process.env.VITE_DATA_URL}/amendments/vote/main`, {
      status: 200,
      response: amendmentsRaw,
    })
    renderComponent()

    expect(screen.queryByTitle('amendments-table')).toBeDefined()
    expect(screen.queryByTitle('summary')).toHaveTextContent('amendments')
    await flushPromises()
    expect(screen.getAllByRole('row')).toHaveLength(
      amendmentsRaw.amendments.length + 1,
    )
  })
})
