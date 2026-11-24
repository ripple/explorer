import { render, cleanup } from '@testing-library/react'
import moxios from 'moxios'
import WS from 'jest-websocket-mock'
import { QueryClientProvider } from 'react-query'
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
import { testQueryClient } from '../../test/QueryClient'
import { SelectedValidatorProvider } from '../useSelectedValidator'
import { StreamsProvider, useStreams } from '../../shared/components/Streams'

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

// Same shape as a validation from this network, but for a ledger index this
// network has not produced and from a key it does not know.
const foreignValidation = {
  ...validationMessage,
  ledger_index: '999999999',
  ledger_hash:
    'FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF',
  validated_hash:
    'EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE',
  validation_public_key:
    'n9UnknownForeignKeyAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
  master_key: 'nHUnknownForeignMasterAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
}

class MockWsClient extends BaseMockWsClient {
  send(message) {
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

const renderedIndexes = (container) =>
  Array.from(container.querySelectorAll('.ledger .ledger-index')).map(
    (element) => element.textContent,
  )

// Renders the `validators` map from StreamsContext directly, since
// LedgersPage itself never consumes it (only the Validators page does, in
// its own StreamsProvider instance).
function ValidatorsProbe() {
  const { validators } = useStreams()
  return (
    <div data-testid="validators-probe">
      {Object.keys(validators).join(',')}
    </div>
  )
}

describe('Ledgers page: validations from outside this network', () => {
  let server
  let client
  const oldEnvs = process.env

  const renderLedgersPage = () =>
    render(
      <SelectedValidatorProvider>
        <SocketContext.Provider value={client}>
          <NetworkContext.Provider value="main">
            <QuickHarness i18n={i18n} initialEntries={['/']}>
              <LedgersPage />
            </QuickHarness>
          </NetworkContext.Provider>
        </SocketContext.Provider>
      </SelectedValidatorProvider>,
    )

  beforeEach(async () => {
    process.env = { ...oldEnvs, VITE_ENVIRONMENT: 'mainnet' }
    server = new WS(WS_URL, { jsonProtocol: true })
    client = new MockWsClient(WS_URL)
    await server.connected
    moxios.install()
    client.addResponses(rippledResponses)
    moxios.stubRequest(`${process.env.VITE_DATA_URL}/validators/main`, {
      status: 200,
      response: { validators: [] },
    })
    moxios.stubRequest('/api/v1/metrics', {})
  })

  afterEach(() => {
    cleanup()
    process.env = oldEnvs
    moxios.uninstall()
    client.close()
    server.close()
    WS.clean()
  })

  it('does not add a ledger for an out-of-range validation', async () => {
    const { container } = renderLedgersPage()

    server.send(prevLedgerMessage)
    await sleep(400)
    server.send(ledgerMessage)
    server.send(validationMessage)
    await sleep(400)

    const before = renderedIndexes(container)
    expect(before).toContain('68992561')

    server.send(foreignValidation)
    await sleep(600)

    expect(renderedIndexes(container)).toEqual(before)
    expect(renderedIndexes(container)).not.toContain('999999999')
  })

  it('still shows this network once an out-of-range validation arrives first', async () => {
    const { container } = renderLedgersPage()

    // Before any ledger from the connected node, so it cannot set the anchor.
    server.send(foreignValidation)
    await sleep(400)

    server.send(prevLedgerMessage)
    await sleep(400)
    server.send(ledgerMessage)
    server.send(validationMessage)
    await sleep(600)

    const indexes = renderedIndexes(container)
    expect(indexes).not.toContain('999999999')
    expect(indexes).toContain('68992561')
    // The validation for this network's ledger was still applied.
    expect(container.querySelectorAll('.ledger .hash').length).toBeGreaterThan(
      0,
    )
  })

  it('keeps rendering this network under a burst of out-of-range validations', async () => {
    const { container } = renderLedgersPage()

    server.send(prevLedgerMessage)
    await sleep(300)
    server.send(ledgerMessage)
    server.send(validationMessage)
    await sleep(400)

    for (let i = 0; i < 60; i += 1) {
      server.send({
        ...foreignValidation,
        ledger_index: String(999999000 + i),
        ledger_hash: i.toString(16).padStart(64, 'A').toUpperCase(),
      })
    }
    await sleep(900)

    const indexes = renderedIndexes(container)
    expect(indexes).toContain('68992561')
    expect(indexes.filter((index) => index.startsWith('9999'))).toEqual([])
  })

  it('accepts a validation slightly ahead of the last closed ledger', async () => {
    const { container } = renderLedgersPage()

    server.send(prevLedgerMessage)
    await sleep(400)

    // 68992560 has closed; a validation for the next ledger is legitimate.
    server.send({ ...validationMessage, ledger_index: '68992562' })
    await sleep(600)

    expect(renderedIndexes(container)).toContain('68992562')
  })

  it('drops a validation whose ledger index is not a number', async () => {
    const { container } = renderLedgersPage()

    server.send(prevLedgerMessage)
    await sleep(400)
    const before = renderedIndexes(container)

    server.send({ ...validationMessage, ledger_index: 'not-a-number' })
    await sleep(600)

    expect(renderedIndexes(container)).toEqual(before)
  })

  it('prunes an out-of-range ledger when the ledger stream sets the anchor first', async () => {
    // Make the initial `getLedger({ ledger_index: 'validated' })` request
    // (fired on mount) reject, so the only way the anchor gets set is via the
    // `ledger` stream handler itself, not `populateFromLedgerResponse`.
    const originalSend = client.send.bind(client)
    client.send = (message) =>
      message.command === 'ledger' && message.ledger_index === 'validated'
        ? Promise.reject(new Error('validated ledger request delayed'))
        : originalSend(message)

    const { container } = renderLedgersPage()

    // Before any `ledger` stream message, so it cannot set the anchor.
    server.send(foreignValidation)
    await sleep(200)
    expect(renderedIndexes(container)).toContain('999999999')

    // The `ledger` stream is now the first thing to establish the anchor.
    server.send(prevLedgerMessage)
    await sleep(400)

    expect(renderedIndexes(container)).not.toContain('999999999')
    expect(renderedIndexes(container)).toContain('68992560')
  })

  it('does not leak an out-of-range validation into validators once the anchor is known', async () => {
    const { getByTestId } = render(
      <QueryClientProvider client={testQueryClient}>
        <SocketContext.Provider value={client}>
          <StreamsProvider>
            <ValidatorsProbe />
          </StreamsProvider>
        </SocketContext.Provider>
      </QueryClientProvider>,
    )

    // Accepted into the queue while the anchor is still unknown.
    server.send(foreignValidation)
    await sleep(50)

    // The anchor becomes known before the queue is next drained (drains
    // happen every THROTTLE=200ms).
    server.send(prevLedgerMessage)
    await sleep(300)

    expect(getByTestId('validators-probe').textContent).not.toContain(
      foreignValidation.validation_public_key,
    )
  })
})
