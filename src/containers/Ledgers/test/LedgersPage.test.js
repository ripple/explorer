import { render, fireEvent, waitFor, cleanup } from '@testing-library/react'
import moxios from 'moxios'
import WS from 'jest-websocket-mock'
import i18n from '../../../i18n/testConfig'
import { LedgersPage } from '../index'
import SocketContext from '../../shared/SocketContext'
import NetworkContext from '../../shared/NetworkContext'
import BaseMockWsClient from '../../test/mockWsClient'
import prevLedgerMessage from './mock/prevLedger.json'
import ledgerMessage from './mock/ledger.json'
import validationMessage from './mock/validation.json'
import rippledResponses from './mock/rippled.json'
import { QuickHarness } from '../../test/utils'
import { SelectedValidatorProvider } from '../useSelectedValidator'

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

const LEDGER_HASH_MAP = new Map([
  [
    'A5F887A191348B69129B168EDA5BC8EEE9EAC60E2599A8034742199471C70604',
    68992561,
  ],
  [
    '0C12B30677B3D8D6ADC7DCC8528694E2FD1515950FB2AAD621D9E9B31833B444',
    68992560,
  ],
])

const MOCK_VALIDATORS = [
  {
    signing_key: 'n9M2anhK2HzFFiJZRoGKhyLpkh55ZdeWw8YyGgvkzY7AkBvz5Vyj',
    master_key: 'nHUfPizyJyhAJZzeq3duRVrZmsTZfcLn7yLF5s2adzHdcHMb9HmQ',
    unl: process.env.VITE_VALIDATOR,
  },
  {
    signing_key: 'n9KaxgJv69FucW5kkiaMhCqS6sAR1wUVxpZaZmLGVXxAcAse9YhR',
    master_key: 'nHBidG3pZK11zQD6kpNDoAhDxH6WLGui6ZxSbUx7LSqLHsgzMPec',
    unl: process.env.VITE_VALIDATOR,
  },
  {
    signing_key: 'n9K7Wfxgyqw4XSQ1BaiKPHKxw2D9BiBiseyn7Ldg7KieQZJfrPf4',
    master_key: 'nHUkhmyFPr3vEN3C8yfhKp4pu4t3wkTCi2KEDBWhyMNpsMj2HbnD',
    unl: null,
  },
]

class MockWsClient extends BaseMockWsClient {
  send(message) {
    if (this.debug) {
      // eslint-disable-next-line no-console -- For debugging purposes
      console.log(message)
    }
    if (this.returnError) {
      return Promise.reject(new Error({}))
    }
    const { command } = message
    if (command === 'ledger') {
      const response = JSON.parse(JSON.stringify(this.responses[command]))
      response.result.ledger_hash = message.ledger_hash
      response.result.ledger.hash = message.ledger_hash
      response.result.ledger.ledger_hash = message.ledger_hash
      response.result.ledger.ledger_index = LEDGER_HASH_MAP.get(
        message.ledger_hash,
      )
      response.result.ledger_index = LEDGER_HASH_MAP.get(message.ledger_hash)
      return Promise.resolve(response.result)
    }
    return Promise.resolve(this.responses[command]?.result)
  }
}

const WS_URL = 'wss://fakenode.ripple.com:51233'

describe('Ledgers Page container', () => {
  let server
  let client
  const renderLedgersPage = (props = { network: 'main', path: '/' }) =>
    render(
      <SelectedValidatorProvider>
        <SocketContext.Provider value={client}>
          <NetworkContext.Provider value={props.network}>
            <QuickHarness i18n={i18n} initialEntries={[props.path]}>
              <LedgersPage />
            </QuickHarness>
          </NetworkContext.Provider>
        </SocketContext.Provider>
      </SelectedValidatorProvider>,
    )

  const oldEnvs = process.env

  beforeEach(async () => {
    process.env = { ...oldEnvs, VITE_ENVIRONMENT: 'mainnet' }
    server = new WS(WS_URL, { jsonProtocol: true })
    client = new MockWsClient(WS_URL)
    await server.connected
    moxios.install()
  })

  afterEach(() => {
    cleanup()
    process.env = oldEnvs
    moxios.uninstall()
    client.close()
    server.close()
    WS.clean()
  })

  it('renders without crashing', () => {
    renderLedgersPage()
  })

  it('renders all parts', () => {
    moxios.stubRequest(`${process.env.VITE_DATA_URL}/validators/main`, {
      status: 200,
      response: [],
    })

    const { container } = renderLedgersPage()
    expect(container.querySelectorAll('.ledgers').length).toBe(1)
  })

  it('receives messages from streams', async () => {
    client.addResponses(rippledResponses)

    moxios.stubRequest(`${process.env.VITE_DATA_URL}/validators/main`, {
      status: 200,
      response: {
        validators: MOCK_VALIDATORS,
      },
    })

    moxios.stubRequest('/api/v1/metrics', {
      base_fee: '0.00001',
      txn_sec: '12.19',
      txn_ledger: '46.94',
      ledger_interval: '3.850',
      avg_fee: '0.001882',
    })
    const { container, unmount } = renderLedgersPage()

    expect(container.querySelectorAll('.ledger').length).toBe(0)
    expect(container.querySelectorAll('.validation').length).toBe(0)
    expect(container.querySelectorAll('.txn').length).toBe(0)

    server.send(prevLedgerMessage)
    await sleep(260)
    expect(container.querySelectorAll('.ledgers').length).toBe(1)
    expect(container.querySelectorAll('.ledger-list').length).toBe(1)
    expect(container.querySelectorAll('.ledger').length).toBe(2)

    server.send(validationMessage)
    await sleep(200 * 2)

    expect(container.querySelectorAll('.validation').length).toBe(1)

    server.send(ledgerMessage)
    expect(container.querySelectorAll('.ledger').length).toBe(2)

    server.send({ type: 'invalid' })
    server.send(null)

    expect(container.querySelectorAll('.ledger').length).toBe(2)
    expect(
      container.querySelectorAll('.selected-validator .pubkey').length,
    ).toBe(0)
    expect(container.querySelectorAll('.tooltip').length).toBe(0)

    const unlCounter = container.querySelector('.ledger .hash .missed')
    expect(unlCounter.textContent).toBe('unl:1/2')
    fireEvent.mouseMove(unlCounter)
    await waitFor(() => {
      expect(
        container.querySelectorAll('.tooltip').length,
      ).toBeGreaterThanOrEqual(1)
    })
    expect(container.querySelector('.tooltip .pubkey').textContent).toBe(
      'nHUfPizyJyhAJZzeq3duRVrZmsTZfcLn7yLF5s2adzHdcHMb9HmQ',
    )
    fireEvent.mouseLeave(unlCounter)

    const validations = container.querySelectorAll('div.validation')
    const txn = container.querySelectorAll('a.txn')

    expect(txn.length).toBe(12)
    fireEvent.focus(txn[0])
    fireEvent.mouseOver(txn[0])

    expect(validations.length).toBe(1)
    fireEvent.mouseOver(validations[0])
    await waitFor(() => {
      expect(
        container.querySelectorAll('.tooltip').length,
      ).toBeGreaterThanOrEqual(1)
    })
    fireEvent.mouseLeave(validations[0])
    await waitFor(() => {
      expect(container.querySelectorAll('.tooltip').length).toBe(0)
    })
    fireEvent.focus(validations[0])
    expect(
      container.querySelectorAll('.selected-validator a.pubkey').length,
    ).toBe(0)
    fireEvent.click(validations[0])
    await waitFor(() => {
      expect(
        container.querySelectorAll('.selected-validator a.pubkey').length,
      ).toBe(1)
    })
    fireEvent.click(validations[0])
    await waitFor(() => {
      expect(
        container.querySelectorAll('.selected-validator a.pubkey').length,
      ).toBe(0)
    })

    unmount()
    await sleep(100)
    expect(client.listenerCount('ledger')).toBe(0)
    expect(client.listenerCount('validation')).toBe(0)
  }, 8000)

  describe('Custom network tests', () => {
    beforeEach(() => {
      process.env = { ...oldEnvs, VITE_ENVIRONMENT: 'custom' }
    })

    afterEach(() => {
      process.env = oldEnvs
    })

    it('receives messages from streams', async () => {
      client.addResponses(rippledResponses)
      const customNetwork = 'custom_network'

      moxios.stubRequest(
        `${process.env.VITE_DATA_URL}/validators/${customNetwork}`,
        {
          status: 200,
          response: {
            validators: MOCK_VALIDATORS,
          },
        },
      )

      const { container, unmount } = renderLedgersPage({
        network: customNetwork,
        path: '/my.custom.com',
      })

      await sleep(100)

      expect(container.querySelectorAll('.validation').length).toBe(0)
      expect(container.querySelectorAll('.ledger').length).toBe(1)
      expect(container.querySelectorAll('.txn').length).toBe(6)

      server.send(prevLedgerMessage)
      await sleep(260)
      expect(container.querySelectorAll('.ledger').length).toBe(2)

      server.send(validationMessage)
      await sleep(200 * 2)
      expect(container.querySelectorAll('.validation').length).toBe(1)

      server.send(ledgerMessage)
      await sleep(250)
      expect(container.querySelectorAll('.ledger').length).toBe(2)

      server.send({ type: 'invalid' })
      server.send(null)

      expect(container.querySelectorAll('.ledger').length).toBe(2)
      expect(
        container.querySelectorAll('.selected-validator .pubkey').length,
      ).toBe(0)
      expect(container.querySelectorAll('.tooltip').length).toBe(0)

      const unlCounter = container.querySelector('.ledger .hash .missed')
      expect(unlCounter.textContent).toBe('unl:1/2')
      fireEvent.mouseMove(unlCounter)
      await waitFor(() => {
        expect(
          container.querySelectorAll('.tooltip').length,
        ).toBeGreaterThanOrEqual(1)
      })
      expect(container.querySelector('.tooltip .pubkey').textContent).toBe(
        'nHUfPizyJyhAJZzeq3duRVrZmsTZfcLn7yLF5s2adzHdcHMb9HmQ',
      )
      fireEvent.mouseLeave(unlCounter)

      const validations = container.querySelectorAll('div.validation')
      const txn = container.querySelectorAll('a.txn')

      expect(txn.length).toBe(12)
      fireEvent.focus(txn[0])
      fireEvent.mouseOver(txn[0])

      expect(validations.length).toBe(1)
      fireEvent.mouseOver(validations[0])
      await waitFor(() => {
        expect(
          container.querySelectorAll('.tooltip').length,
        ).toBeGreaterThanOrEqual(1)
      })
      fireEvent.mouseLeave(validations[0])
      await waitFor(() => {
        expect(container.querySelectorAll('.tooltip').length).toBe(0)
      })
      fireEvent.focus(validations[0])
      expect(
        container.querySelectorAll('.selected-validator .pubkey').length,
      ).toBe(0)
      fireEvent.click(validations[0])
      await waitFor(() => {
        expect(
          container.querySelectorAll('.selected-validator a.pubkey').length,
        ).toBe(1)
      })
      expect(
        container
          .querySelector('.selected-validator a.pubkey')
          .getAttribute('href'),
      ).toBe('/validators/n9KaxgJv69FucW5kkiaMhCqS6sAR1wUVxpZaZmLGVXxAcAse9YhR')
      fireEvent.click(validations[0])
      await waitFor(() => {
        expect(
          container.querySelectorAll('.selected-validator .pubkey').length,
        ).toBe(0)
      })

      unmount()
    }, 8000)
  })
})
