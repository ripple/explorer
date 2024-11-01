import {
  cleanup,
  render,
  screen,
  within,
  fireEvent,
} from '@testing-library/react'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import { Provider } from 'react-redux'
import { initialState } from '../../../rootReducer'
import i18n from '../../../i18n/testConfig'
import SidechainHome from '../index'
import MockWsClient from '../../test/mockWsClient'
import { CUSTOM_NETWORKS_STORAGE_KEY } from '../../shared/hooks'
import { QuickHarness } from '../../test/utils'

describe('SidechainHome page', () => {
  let client

  const middlewares = [thunk]
  const mockStore = configureMockStore(middlewares)

  const renderComponent = (localNetworks = null) => {
    localStorage.removeItem(CUSTOM_NETWORKS_STORAGE_KEY)
    if (localNetworks) {
      localStorage.setItem(
        CUSTOM_NETWORKS_STORAGE_KEY,
        JSON.stringify(localNetworks),
      )
    }

    const store = mockStore(initialState)
    return render(
      <Provider store={store}>
        <QuickHarness i18n={i18n}>
          <SidechainHome />
        </QuickHarness>
      </Provider>,
    )
  }

  beforeEach(async () => {
    client = new MockWsClient()
  })

  afterEach(() => {
    client.close()
    cleanup()
  })

  it('renders without crashing', () => {
    renderComponent()
    expect(screen.queryByTitle('custom-network-main-page')).toBeDefined()
  })

  it('renders without crashing', () => {
    renderComponent(['custom_url', 'custom_url2'])
    const customNetworks = screen.getAllByTitle('custom-network-name')
    expect(customNetworks).toHaveLength(2)
    expect(customNetworks[0]).toHaveTextContent('custom_url')
    expect(customNetworks[1]).toHaveTextContent('custom_url2')
  })

  describe('test redirects', () => {
    const { location } = window
    const mockedFunction = jest.fn()
    const oldEnvs = process.env

    beforeEach(() => {
      delete window.location
      window.location = { assign: mockedFunction }
      process.env = { ...oldEnvs, VITE_ENVIRONMENT: 'mainnet' }
    })

    afterEach(() => {
      window.location = location
      process.env = oldEnvs
    })

    it('redirect works on `enter` in textbox', () => {
      renderComponent()
      expect(
        within(screen.getByTitle('custom-network-main-page')).queryByRole(
          'textbox',
        ),
      ).toBeDefined()
      const input = within(
        screen.getByTitle('custom-network-main-page'),
      ).getByRole('textbox')

      // TODO: figure out how to use userEvent for this instead
      fireEvent.change(input, { target: { value: 'custom_url' } })
      fireEvent.keyDown(input, { key: 'Enter', code: 'Enter', charCode: 13 })

      expect(mockedFunction).toBeCalledWith(
        `${process.env.VITE_CUSTOMNETWORK_LINK}/custom_url`,
      )
    })
  })
})
