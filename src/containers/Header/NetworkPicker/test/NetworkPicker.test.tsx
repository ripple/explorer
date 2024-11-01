import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { I18nextProvider } from 'react-i18next'
import { BrowserRouter as Router } from 'react-router-dom'
import i18n from '../../../../i18n/testConfigEnglish'
import { CUSTOM_NETWORKS_STORAGE_KEY } from '../../../shared/hooks'
import SocketContext from '../../../shared/SocketContext'
import MockWsClient from '../../../test/mockWsClient'

describe('NetworkPicker component', () => {
  let client
  const { location } = window
  const mockedFunction = jest.fn()
  const oldEnvs = process.env

  const renderComponent = (localNetworks?: string[]) => {
    let Picker

    // Needed to test different env variable values.
    jest.isolateModules(() => {
      ;({ NetworkPicker: Picker } = jest.requireActual('../NetworkPicker'))
    })

    localStorage.removeItem(CUSTOM_NETWORKS_STORAGE_KEY)
    if (localNetworks) {
      localStorage.setItem(
        CUSTOM_NETWORKS_STORAGE_KEY,
        JSON.stringify(localNetworks),
      )
    }

    return render(
      <I18nextProvider i18n={i18n}>
        <Router>
          <SocketContext.Provider value={client}>
            <Picker />
          </SocketContext.Provider>
        </Router>
      </I18nextProvider>,
    )
  }

  beforeEach(() => {
    // @ts-ignore -- typescript does not like mocking window
    delete window.location
    // @ts-ignore -- typescript does not like mocking window
    window.location = { assign: mockedFunction }
    process.env = {
      ...oldEnvs,
      VITE_ENVIRONMENT: 'mainnet',
      VITE_MAINNET_LINK: 'https://livenet.xrpl.org',
      VITE_TESTNET_LINK: 'https://testnet.xrpl.org',
      VITE_DEVNET_LINK: 'https://devnet.xrpl.org',
      VITE_AMM_LINK: 'https://amm-devnet.xrpl.org',
      VITE_CUSTOMNETWORK_LINK: 'https://custom.xrpl.org',
    }
    client = new MockWsClient()
  })

  afterEach(() => {
    client.close()
    window.location = location
    process.env = oldEnvs
    cleanup()
  })

  it('dropdown expands', () => {
    renderComponent()
    expect(screen.queryByTestId('dropdown')).toBeDefined()
    expect(screen.getByTestId('dropdown')).not.toHaveClass('dropdown-expanded')

    fireEvent.click(screen.getByRole('button'))
    expect(screen.getByTestId('dropdown')).toHaveClass('dropdown-expanded')
  })

  it('direct to other networks', () => {
    renderComponent()

    // expand dropdown
    expect(screen.queryByTestId('dropdown')).toBeDefined()
    fireEvent.click(screen.getByRole('button'))
    expect(screen.queryByTestId('dropdown-item-mainnet')).toBeNull() // don't show the current network
    expect(screen.queryByTestId('dropdown-item-testnet')).toBeDefined()

    // test clicking on testnet
    fireEvent.click(screen.getByTestId('dropdown-item-testnet'))
    expect(screen.getByTestId('dropdown-item-testnet')).toHaveAttribute(
      'href',
      process.env.VITE_TESTNET_LINK,
    )

    expect(screen.getByTestId('dropdown-item-devnet')).toHaveAttribute(
      'href',
      process.env.VITE_DEVNET_LINK,
    )
  })

  it('redirect on custom network input works', () => {
    renderComponent()

    fireEvent.click(screen.getByRole('button'))
    const customInput = screen.getByRole('textbox')
    // TODO: figure out how to use userEvent for this instead
    fireEvent.click(customInput)
    fireEvent.change(customInput, { target: { value: 'custom_url' } })
    fireEvent.submit(screen.getByTitle('custom-network-form'))

    expect(mockedFunction).toBeCalledWith(
      `${process.env.VITE_CUSTOMNETWORK_LINK}/custom_url`,
    )
  })

  it('shows no network selected in custom mode with no network', () => {
    process.env.VITE_ENVIRONMENT = 'custom'
    renderComponent()

    // expand dropdown
    expect(screen.getByTestId('dropdown')).toHaveClass('network-custom')
    expect(screen.getByRole('button')).toHaveTextContent(
      'No Custom Network Selected',
    )
  })

  it('shows custom networks in local storage if they exist', () => {
    process.env.VITE_ENVIRONMENT = 'custom'
    renderComponent(['custom_url', 'custom_url2'])

    // expand dropdown
    expect(screen.getByTestId('dropdown')).toHaveClass('network-custom')

    expect(screen.getAllByTestId('dropdown-item-custom')).toHaveLength(2)
    expect(screen.getAllByTestId('dropdown-item-custom')[0]).toHaveAttribute(
      'href',
      `${process.env.VITE_CUSTOMNETWORK_LINK}/custom_url`,
    )
    expect(screen.getAllByTestId('dropdown-item-custom')[1]).toHaveAttribute(
      'href',
      `${process.env.VITE_CUSTOMNETWORK_LINK}/custom_url2`,
    )
    expect(screen.getAllByTestId('btn-remove')).toHaveLength(2)

    expect(screen.queryByTestId('dropdown-item-testnet')).toBeDefined()
    expect(screen.queryByTestId('dropdown-item-testnet .btn-remove')).toBeNull()
  })
})
