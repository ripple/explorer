import React from 'react'
import { mount } from 'enzyme'
import moxios from 'moxios'
import WS from 'jest-websocket-mock'
import { BrowserRouter as Router } from 'react-router-dom'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import { Provider } from 'react-redux'
import { I18nextProvider } from 'react-i18next'
import { QueryClientProvider } from 'react-query'
import i18n from '../../../i18nTestConfig'
import Ledgers from '../index'
import { initialState } from '../../../rootReducer'
import SocketContext from '../../shared/SocketContext'
import BaseMockWsClient from '../../test/mockWsClient'
import prevLedgerMessage from './mock/prevLedger.json'
import ledgerMessage from './mock/ledger.json'
import validationMessage from './mock/validation.json'
import rippledResponses from './mock/rippled.json'
import { testQueryClient } from '../../test/QueryClient'

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

const WS_URL = 'ws://localhost:1234'

describe('Ledgers Page container', () => {
  let server
  let client
  const middlewares = [thunk]
  const mockStore = configureMockStore(middlewares)
  const createWrapper = (props = {}) => {
    const store = mockStore({ ...initialState })

    return mount(
      <QueryClientProvider client={testQueryClient}>
        <Router>
          <I18nextProvider i18n={i18n}>
            <Provider store={store}>
              <SocketContext.Provider value={client}>
                <Ledgers msg={props.msg} />
              </SocketContext.Provider>
            </Provider>
          </I18nextProvider>
        </Router>
      </QueryClientProvider>,
    )
  }

  const oldEnvs = process.env

  beforeEach(async () => {
    process.env = { ...oldEnvs, VITE_ENVIRONMENT: 'mainnet' }
    server = new WS(WS_URL, { jsonProtocol: true })
    client = new MockWsClient(WS_URL)
    await server.connected
    moxios.install()
  })

  afterEach(() => {
    process.env = oldEnvs
    moxios.uninstall()
    client.close()
    server.close()
    WS.clean()
  })

  it('renders without crashing', () => {
    const wrapper = createWrapper()
    wrapper.unmount()
  })

  it('renders all parts', () => {
    moxios.stubRequest(`${process.env.VITE_DATA_URL}/validators/main`, {
      status: 200,
      response: [],
    })

    const wrapper = createWrapper()
    expect(wrapper.find('.ledgers').length).toBe(1)
    wrapper.unmount()
  })

  it('receives messages from streams', async () => {
    client.addResponses(rippledResponses)
    const wrapper = createWrapper()

    moxios.stubRequest(`${process.env.VITE_DATA_URL}/validators/main`, {
      status: 200,
      response: {
        validators: [
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
        ],
      },
    })

    moxios.stubRequest('/api/v1/metrics', {
      base_fee: '0.00001',
      txn_sec: '12.19',
      txn_ledger: '46.94',
      ledger_interval: '3.850',
      avg_fee: '0.001882',
    })

    expect(wrapper.find('.ledger').length).toBe(0)
    expect(wrapper.find('.validation').length).toBe(0)
    expect(wrapper.find('.txn').length).toBe(0)

    server.send(prevLedgerMessage)
    await sleep(260)
    wrapper.update()
    expect(wrapper.find('.ledger').length).toBe(1)

    server.send(validationMessage)
    wrapper.update()
    expect(wrapper.find('.validation').length).toBe(1)

    server.send(ledgerMessage)
    await sleep(250)
    wrapper.update()
    expect(wrapper.find('.ledger').length).toBe(2)

    server.send({ type: 'invalid' })
    server.send(null)
    wrapper.update()

    expect(wrapper.find('.ledger').length).toBe(2)
    expect(wrapper.find('.selected-validator .pubkey').length).toBe(0)
    expect(wrapper.find('.tooltip').length).toBe(0)

    const unlCounter = wrapper.find('.ledger .hash .missed')
    expect(unlCounter.text()).toBe('unl:1/2')
    unlCounter.simulate('mouseMove')
    expect(wrapper.find('.tooltip').length).toBe(1)
    expect(wrapper.find('.tooltip .pubkey').text()).toBe(
      'nHUfPizyJyhAJZzeq3duRVrZmsTZfcLn7yLF5s2adzHdcHMb9HmQ',
    )

    const validations = wrapper.find('div.validation')
    const txn = wrapper.find('.txn')

    // check ledger transactions
    expect(txn.length).toBe(36)
    txn.first().simulate('focus')
    txn.first().simulate('mouseOver')

    // check validations
    expect(validations.length).toBe(1)
    validations.first().simulate('mouseOver')
    expect(wrapper.find('.tooltip').length).toBe(1)
    validations.first().simulate('mouseLeave')
    expect(wrapper.find('.tooltip').length).toBe(0)
    validations.first().simulate('focus')
    expect(wrapper.find('.selected-validator .pubkey').length).toBe(0)
    validations.first().simulate('click') // set selected
    expect(wrapper.find('.selected-validator .pubkey').length).toBe(1)
    validations.first().simulate('click') // unset selected
    expect(wrapper.find('.selected-validator .pubkey').length).toBe(0)

    wrapper.unmount()

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
      const wrapper = createWrapper()

      moxios.stubRequest(`${process.env.VITE_DATA_URL}/validators/`, {
        status: 200,
        response: {
          validators: [
            {
              signing_key:
                'n9M2anhK2HzFFiJZRoGKhyLpkh55ZdeWw8YyGgvkzY7AkBvz5Vyj',
              master_key:
                'nHUfPizyJyhAJZzeq3duRVrZmsTZfcLn7yLF5s2adzHdcHMb9HmQ',
              unl: process.env.VITE_VALIDATOR,
            },
            {
              signing_key:
                'n9KaxgJv69FucW5kkiaMhCqS6sAR1wUVxpZaZmLGVXxAcAse9YhR',
              master_key:
                'nHBidG3pZK11zQD6kpNDoAhDxH6WLGui6ZxSbUx7LSqLHsgzMPec',
              unl: process.env.VITE_VALIDATOR,
            },
            {
              signing_key:
                'n9K7Wfxgyqw4XSQ1BaiKPHKxw2D9BiBiseyn7Ldg7KieQZJfrPf4',
              master_key:
                'nHUkhmyFPr3vEN3C8yfhKp4pu4t3wkTCi2KEDBWhyMNpsMj2HbnD',
              unl: null,
            },
          ],
        },
      })

      expect(wrapper.find('.ledger').length).toBe(0)
      expect(wrapper.find('.validation').length).toBe(0)
      expect(wrapper.find('.txn').length).toBe(0)

      server.send(prevLedgerMessage)
      await sleep(260)
      wrapper.update()
      expect(wrapper.find('.ledger').length).toBe(1)

      server.send(validationMessage)
      wrapper.update()
      expect(wrapper.find('.validation').length).toBe(1)

      server.send(ledgerMessage)
      await sleep(250)
      wrapper.update()
      expect(wrapper.find('.ledger').length).toBe(2)

      server.send({ type: 'invalid' })
      server.send(null)
      wrapper.update()

      expect(wrapper.find('.ledger').length).toBe(2)
      expect(wrapper.find('.selected-validator .pubkey').length).toBe(0)
      expect(wrapper.find('.tooltip').length).toBe(0)

      const unlCounter = wrapper.find('.ledger .hash .missed')
      expect(unlCounter.text()).toBe('unl:1/2')
      unlCounter.simulate('mouseMove')
      expect(wrapper.find('.tooltip').length).toBe(1)
      expect(wrapper.find('.tooltip .pubkey').text()).toBe(
        'nHUfPizyJyhAJZzeq3duRVrZmsTZfcLn7yLF5s2adzHdcHMb9HmQ',
      )

      const validations = wrapper.find('div.validation')
      const txn = wrapper.find('.txn')

      // check ledger transactions
      expect(txn.length).toBe(36)
      txn.first().simulate('focus')
      txn.first().simulate('mouseOver')

      // check validations
      expect(validations.length).toBe(1)
      validations.first().simulate('mouseOver')
      expect(wrapper.find('.tooltip').length).toBe(1)
      validations.first().simulate('mouseLeave')
      expect(wrapper.find('.tooltip').length).toBe(0)
      validations.first().simulate('focus')
      expect(wrapper.find('.selected-validator .pubkey').length).toBe(0)
      validations.first().simulate('click') // set selected
      expect(wrapper.find('.selected-validator .pubkey').length).toBe(1)
      validations.first().simulate('click') // unset selected
      expect(wrapper.find('.selected-validator .pubkey').length).toBe(0)

      wrapper.unmount()
    }, 8000)
  })
})
