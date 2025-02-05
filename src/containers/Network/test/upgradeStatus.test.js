import { render, screen, cleanup, fireEvent } from '@testing-library/react'
import moxios from 'moxios'
import WS from 'jest-websocket-mock'
import { Route } from 'react-router'
import i18n from '../../../i18n/testConfig'
import { Network } from '../index'
import SocketContext from '../../shared/SocketContext'
import MockWsClient from '../../test/mockWsClient'
import { QuickHarness } from '../../test/utils'
import { NETWORK_ROUTE } from '../../App/routes'
import {
  aggregateData,
  aggregateNodes,
  aggregateValidators,
} from '../UpgradeStatus'

const undefinedValidatorsData = [
  {
    ledger_index: 74661353,
    ledger_hash:
      '613E298A8C0AEB816D16AA61952E0834BBD9B5E5677EA3E9A2413118EE074363',
  },
  {
    master_key: 'nHUakYHufAvdx5XqTS2F4Pu7i8fQqDqpKqXN2kUGHhBFcG38GNqL',
    signing_key: 'n9M38x7Sf7epp3gaxgcFxEtwkSc4w2ePb1SgfLiz9bVCr5Lvzrm8',
    unl: false,
    domain: 'gerty.one',
    ledger_index: 74554449,
    server_version: '1.9.4',
    agreement_1hour: {
      missed: 936,
      total: 936,
      score: '0.00000',
      incomplete: false,
    },
    agreement_24hour: {
      missed: 22338,
      total: 22338,
      score: '0.00000',
      incomplete: false,
    },
    agreement_30day: {
      missed: 263139,
      total: 535427,
      score: '0.50854',
      incomplete: false,
    },
    chain: 'chain.4',
    partial: false,
  },
]

const nodesData = [
  {
    node_public_key: 'n9JoeT8XKeBSR8y4D9aDz2PL1DD1j6LQwkRTbH2eFqeRmWYHj2Nw',
    networks: 'dev',
    complete_ledgers: '22085270-29882772',
    ip: '34.208.12.148',
    port: 2459,
    uptime: 1257336,
    version: '1.11.0-rc3',
    server_state: 'full',
    io_latency_ms: 1,
    load_factor_server: '256',
    inbound_count: 4,
    outbound_count: 9,
    lat: '45.82',
    long: '-119.73',
    country_code: 'US',
    country: 'United States',
    region: 'Oregon',
    region_code: 'OR',
    city: 'Boardman',
    postal_code: '97818',
    timezone: 'America/Los_Angeles',
  },
]

describe('UpgradeStatus test functions', () => {
  it('aggregate data works with validators without keys', () => {
    const validatorAggregate = aggregateValidators(undefinedValidatorsData)
    expect(validatorAggregate).toEqual({
      '1.9.4': { validatorCount: 1, validatorPercent: 100 },
    })
    const nodeAggregate = aggregateNodes(nodesData)
    expect(nodeAggregate).toEqual({
      '1.11.0-rc3': { nodeCount: 1, nodePercent: 100 },
    })
    expect(aggregateData(validatorAggregate, nodeAggregate)).toEqual([
      {
        label: '1.9.4',
        validatorCount: 1,
        validatorPercent: 100,
        nodeCount: 0,
        nodePercent: 0,
      },
      {
        label: '1.11.0-rc3',
        validatorCount: 0,
        validatorPercent: 0,
        nodeCount: 1,
        nodePercent: 100,
      },
    ])
  })
})

describe('UpgradeStatus renders', () => {
  let server
  let client
  const WS_URL = 'ws://localhost:1234'
  const renderComponent = () =>
    render(
      <SocketContext.Provider value={client}>
        <QuickHarness i18n={i18n} initialEntries={['/network/upgrade-status']}>
          <Route path={NETWORK_ROUTE.path} element={<Network />} />
        </QuickHarness>
      </SocketContext.Provider>,
    )

  beforeEach(async () => {
    window.ResizeObserver = jest.fn().mockImplementation(() => ({
      observe: jest.fn(),
      unobserve: jest.fn(),
      disconnect: jest.fn(),
    }))
    server = new WS(WS_URL, { jsonProtocol: true })
    client = new MockWsClient(WS_URL)
    await server.connected
    moxios.install()
  })

  afterEach(async () => {
    cleanup()
    moxios.uninstall()
    server.close()
    client.close()
    WS.clean()
  })

  it('renders without crashing', async () => {
    renderComponent()
  })

  it('renders when nodes request errors', async () => {
    moxios.stubRequest(`${process.env.VITE_DATA_URL}/validators/main`, {
      status: 200,
      response: { validators: undefinedValidatorsData },
    })
    moxios.stubRequest(`${process.env.VITE_DATA_URL}/topology/nodes/main`, {
      status: 502,
    })

    renderComponent()
    expect(screen.queryByTitle('barchart')).toBeDefined()
  })
})
